from flask import Blueprint, render_template, request, redirect, url_for, flash, jsonify
from flask_login import login_required, current_user
from app import db
from app.models import Addiction, AddictionTrackingEntry, AddictionGoal
from datetime import datetime, date, timedelta
import calendar

tracking_bp = Blueprint("tracking", __name__)


@tracking_bp.route("/dashboard")
@login_required
def dashboard():
    """Personal tracking dashboard showing goals and recent activity"""
    # Get active goals
    active_goals = AddictionGoal.query.filter_by(
        user_id=current_user.id, is_active=True
    ).order_by(AddictionGoal.created_at.desc()).limit(5).all()

    # Get recent tracking entries (last 7 days)
    week_ago = date.today() - timedelta(days=7)
    recent_entries = AddictionTrackingEntry.query.filter(
        AddictionTrackingEntry.user_id == current_user.id,
        AddictionTrackingEntry.entry_date >= week_ago
    ).order_by(AddictionTrackingEntry.entry_date.desc()).limit(10).all()

    # Get progress stats
    total_entries = AddictionTrackingEntry.query.filter_by(user_id=current_user.id).count()
    completed_goals = AddictionGoal.query.filter_by(
        user_id=current_user.id, is_completed=True
    ).count()

    return render_template(
        "tracking/dashboard.html",
        active_goals=active_goals,
        recent_entries=recent_entries,
        total_entries=total_entries,
        completed_goals=completed_goals
    )


@tracking_bp.route("/<slug>")
@login_required
def addiction_calendar(slug):
    """Calendar view for tracking a specific addiction"""
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()

    # Get current year and month from query params
    year = request.args.get('year', date.today().year, type=int)
    month = request.args.get('month', date.today().month, type=int)

    # Validate month/year
    if month < 1 or month > 12:
        month = date.today().month
    if year < 2020 or year > 2030:  # Reasonable bounds
        year = date.today().year

    # Get tracking entries for this addiction and user in the selected month
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        end_date = date(year, month + 1, 1) - timedelta(days=1)

    entries = AddictionTrackingEntry.query.filter(
        AddictionTrackingEntry.user_id == current_user.id,
        AddictionTrackingEntry.addiction_id == addiction.id,
        AddictionTrackingEntry.entry_date >= start_date,
        AddictionTrackingEntry.entry_date <= end_date
    ).all()

    # Create calendar data
    cal = calendar.monthcalendar(year, month)
    entry_dates = {entry.entry_date.day: entry for entry in entries}

    # Get user's goals for this addiction
    goals = AddictionGoal.query.filter_by(
        user_id=current_user.id,
        addiction_id=addiction.id,
        is_active=True
    ).all()

    return render_template(
        "tracking/calendar.html",
        addiction=addiction,
        calendar=cal,
        entry_dates=entry_dates,
        year=year,
        month=month,
        month_name=calendar.month_name[month],
        goals=goals
    )


@tracking_bp.route("/<slug>/add-entry", methods=["GET", "POST"])
@login_required
def add_entry(slug):
    """Add a new tracking entry for an addiction"""
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()

    if request.method == "POST":
        entry_date = datetime.strptime(request.form.get("entry_date"), "%Y-%m-%d").date()
        entry_type = request.form.get("entry_type")
        description = request.form.get("description", "").strip()
        quantity = request.form.get("quantity", "").strip()
        severity = int(request.form.get("severity", 1))
        notes = request.form.get("notes", "").strip()

        if not entry_type:
            flash("Please select an entry type.", "error")
            return redirect(request.url)

        entry = AddictionTrackingEntry(
            user_id=current_user.id,
            addiction_id=addiction.id,
            entry_date=entry_date,
            entry_type=entry_type,
            description=description or None,
            quantity=quantity or None,
            severity=severity,
            notes=notes or None
        )

        db.session.add(entry)
        db.session.commit()

        flash("Entry added successfully!", "success")
        return redirect(url_for("tracking.addiction_calendar", slug=slug))

    return render_template("tracking/add_entry.html", addiction=addiction)


@tracking_bp.route("/<slug>/goals")
@login_required
def goals(slug):
    """View goals for a specific addiction"""
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()

    # Get all goals for this addiction
    goals = AddictionGoal.query.filter_by(
        user_id=current_user.id, addiction_id=addiction.id
    ).order_by(AddictionGoal.created_at.desc()).all()

    # Calculate statistics
    active_goals = [g for g in goals if not g.is_completed]
    completed_goals = [g for g in goals if g.is_completed]
    completion_rate = (len(completed_goals) / len(goals) * 100) if goals else 0

    return render_template(
        "tracking/goals.html",
        addiction=addiction,
        goals=goals,
        active_goals=active_goals,
        completed_goals=completed_goals,
        completion_rate=round(completion_rate, 1)
    )


@tracking_bp.route("/entry/<int:entry_id>/edit", methods=["GET", "POST"])
@login_required
def edit_entry(entry_id):
    """Edit an existing tracking entry"""
    entry = AddictionTrackingEntry.query.filter_by(
        id=entry_id, user_id=current_user.id
    ).first_or_404()

    if request.method == "POST":
        entry.entry_date = datetime.strptime(request.form.get("entry_date"), "%Y-%m-%d").date()
        entry.entry_type = request.form.get("entry_type")
        entry.description = request.form.get("description", "").strip() or None
        entry.quantity = request.form.get("quantity", "").strip() or None
        entry.severity = int(request.form.get("severity", 1))
        entry.notes = request.form.get("notes", "").strip() or None

        db.session.commit()
        flash("Entry updated successfully!", "success")
        return redirect(url_for("tracking.addiction_calendar", slug=entry.addiction.slug))

    return render_template("tracking/edit_entry.html", entry=entry)


@tracking_bp.route("/entry/<int:entry_id>/delete", methods=["POST"])
@login_required
def delete_entry(entry_id):
    """Delete a tracking entry"""
    entry = AddictionTrackingEntry.query.filter_by(
        id=entry_id, user_id=current_user.id
    ).first_or_404()

    slug = entry.addiction.slug
    db.session.delete(entry)
    db.session.commit()

    flash("Entry deleted successfully!", "success")
    return redirect(url_for("tracking.addiction_calendar", slug=slug))


@tracking_bp.route("/<slug>/add-goal", methods=["GET", "POST"])
@login_required
def add_goal(slug):
    """Add a new goal for an addiction"""
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()

    if request.method == "POST":
        title = request.form.get("title", "").strip()
        description = request.form.get("description", "").strip()
        goal_type = request.form.get("goal_type")
        target_date_str = request.form.get("target_date", "").strip()
        progress_notes = request.form.get("progress_notes", "").strip()

        if not title or not description:
            flash("Please fill in title and description.", "error")
            return redirect(request.url)

        target_date = None
        if target_date_str:
            try:
                target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()
            except ValueError:
                flash("Invalid target date format.", "error")
                return redirect(request.url)

        goal = AddictionGoal(
            user_id=current_user.id,
            addiction_id=addiction.id,
            title=title,
            description=description,
            goal_type=goal_type,
            target_date=target_date,
            progress_notes=progress_notes or None
        )

        db.session.add(goal)
        db.session.commit()

        flash("Goal added successfully!", "success")
        return redirect(url_for("tracking.goals", slug=slug))

    return render_template("tracking/add_goal.html", addiction=addiction)


@tracking_bp.route("/goal/<int:goal_id>/edit", methods=["GET", "POST"])
@login_required
def edit_goal(goal_id):
    """Edit an existing goal"""
    goal = AddictionGoal.query.filter_by(
        id=goal_id, user_id=current_user.id
    ).first_or_404()

    if request.method == "POST":
        goal.title = request.form.get("title", "").strip()
        goal.description = request.form.get("description", "").strip()
        goal.goal_type = request.form.get("goal_type")
        goal.progress_notes = request.form.get("progress_notes", "").strip() or None
        goal.is_completed = request.form.get("is_completed") == "true"

        target_date_str = request.form.get("target_date", "").strip()
        if target_date_str:
            try:
                goal.target_date = datetime.strptime(target_date_str, "%Y-%m-%d").date()
            except ValueError:
                flash("Invalid target date format.", "error")
                return redirect(request.url)
        else:
            goal.target_date = None

        if goal.is_completed and not goal.completed_at:
            goal.completed_at = date.today()

        db.session.commit()
        flash("Goal updated successfully!", "success")
        return redirect(url_for("tracking.goals", slug=goal.addiction.slug))

    return render_template("tracking/edit_goal.html", goal=goal, addiction=goal.addiction)


@tracking_bp.route("/goal/<int:goal_id>/complete", methods=["POST"])
@login_required
def complete_goal(goal_id):
    """Mark a goal as completed"""
    goal = AddictionGoal.query.filter_by(
        id=goal_id, user_id=current_user.id
    ).first_or_404()

    if not goal.is_completed:
        goal.is_completed = True
        goal.completed_at = date.today()
        db.session.commit()
        flash("Goal marked as completed! 🎉", "success")
    else:
        flash("Goal is already completed.", "info")

    return redirect(url_for("tracking.goals", slug=goal.addiction.slug))


@tracking_bp.route("/goal/<int:goal_id>/delete", methods=["POST"])
@login_required
def delete_goal(goal_id):
    """Delete a goal"""
    goal = AddictionGoal.query.filter_by(
        id=goal_id, user_id=current_user.id
    ).first_or_404()

    slug = goal.addiction.slug
    db.session.delete(goal)
    db.session.commit()

    flash("Goal deleted successfully!", "success")
    return redirect(url_for("tracking.goals", slug=slug))