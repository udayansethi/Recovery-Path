from flask import Blueprint, render_template, abort, request, redirect, url_for, flash
from flask_login import login_required, current_user
from app import db
from app.models import Addiction, AddictionStory

addictions_bp = Blueprint("addictions", __name__)


@addictions_bp.route("/")
def list_addictions():
    if not request.args.get("legacy"):
        return redirect("http://localhost:8080/addictions")
    from flask import request

    q = Addiction.query
    cat = request.args.get("category")
    search = request.args.get("search", "").strip()

    if cat:
        q = q.filter(Addiction.category == cat)
    if search:
        q = q.filter(
            Addiction.name.ilike(f"%{search}%")
            | Addiction.description.ilike(f"%{search}%")
        )

    addictions = q.order_by(Addiction.name).all()
    categories = [
        row[0]
        for row in Addiction.query.with_entities(Addiction.category)
        .distinct()
        .all()
    ]

    return render_template(
        "addictions/list.html",
        addictions=addictions,
        categories=categories,
        selected_category=cat,
        search_query=search,
    )


@addictions_bp.route("/<slug>")
def detail(slug):
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()
    return render_template("addictions/detail.html", addiction=addiction)


@addictions_bp.route("/<slug>/stories")
def stories(slug):
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()
    page = request.args.get('page', 1, type=int)
    per_page = 10

    stories_query = addiction.stories.filter_by(is_sample=True)
    stories = stories_query.paginate(page=page, per_page=per_page, error_out=False)

    return render_template("addictions/stories.html", addiction=addiction, stories=stories)


@addictions_bp.route("/<slug>/stories/add", methods=["GET", "POST"])
@login_required
def add_story(slug):
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()

    if request.method == "POST":
        title = request.form.get("title", "").strip()
        content = request.form.get("content", "").strip()
        is_anonymous = request.form.get("anonymous") == "on"

        if not title or not content:
            flash("Please fill in both title and story content.", "error")
            return redirect(request.url)

        author_name = "Anonymous" if is_anonymous else current_user.name

        story = AddictionStory(
            addiction_id=addiction.id,
            user_id=None if is_anonymous else current_user.id,
            author_name=author_name,
            title=title,
            content=content,
            is_anonymous=is_anonymous
        )

        db.session.add(story)
        db.session.commit()

        flash("Your story has been shared successfully!", "success")
        return redirect(url_for("addictions.stories", slug=slug))

    return render_template("addictions/add_story.html", addiction=addiction)
