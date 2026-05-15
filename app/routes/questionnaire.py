from flask import Blueprint, render_template, request, redirect, url_for, abort, jsonify
from flask_login import login_required, current_user

from app import db
from app.models import Addiction, Questionnaire, Question, UserResponse

questionnaire_bp = Blueprint("questionnaire", __name__)


def _get_severity_and_recommendations(total_score, addiction_name):
    if total_score <= 10:
        level = "low"
        tips = [
            "Stay mindful of your habits.",
            "Set small limits to maintain balance.",
            "Find healthy alternatives for stress relief.",
        ]
        professional = "No professional support needed at this time. Keep monitoring."
    elif total_score <= 20:
        level = "moderate"
        tips = [
            "Consider setting clear boundaries.",
            "Identify triggers and plan coping strategies.",
            "Talk to a trusted friend or family member.",
            "Try mindfulness or meditation.",
        ]
        professional = "Consider speaking with a counselor or support group."
    else:
        level = "high"
        tips = [
            "Reach out for professional support.",
            "National helplines are available 24/7.",
            "Consider therapy or structured support programs.",
            "Share your goals with someone you trust.",
        ]
        professional = (
            "We strongly recommend consulting a healthcare provider or addiction specialist. "
            "National helpline (US): 1-800-662-4357 (SAMHSA)."
        )

    return {
        "level": level,
        "tips": tips,
        "professional": professional,
        "addiction_name": addiction_name,
    }


@questionnaire_bp.route("/<slug>", methods=["GET", "POST"])
@login_required
def start(slug):
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()
    questionnaire = addiction.questionnaire
    if not questionnaire:
        abort(404)

    if request.method == "GET":
        return render_template(
            "questionnaire/start.html",
            addiction=addiction,
            questions=questionnaire.questions,
        )

    # Handle both JSON and form data
    try:
        data = request.get_json()
    except:
        data = request.form

    answers = {}
    if isinstance(data, dict):
        for k, v in data.items():
            if k.startswith("q_"):
                try:
                    qid = int(k[2:])
                    answers[qid] = int(v) if isinstance(v, str) and v.isdigit() else v
                except (ValueError, TypeError):
                    pass

    total = sum(
        int(a) for a in answers.values() if isinstance(a, int)
    )
    severity = _get_severity_and_recommendations(total, addiction.name)

    response = UserResponse(
        user_id=current_user.id,
        questionnaire_id=questionnaire.id,
        answers=answers,
        total_score=total,
        severity_level=severity["level"],
    )
    db.session.add(response)
    db.session.commit()

    return render_template(
        "questionnaire/results.html",
        addiction=addiction,
        total_score=total,
        severity=severity,
    )


@questionnaire_bp.route("/<slug>/results")
@login_required
def results(slug):
    addiction = Addiction.query.filter_by(slug=slug).first_or_404()
    latest = (
        UserResponse.query.filter_by(
            user_id=current_user.id,
            questionnaire_id=addiction.questionnaire.id,
        )
        .order_by(UserResponse.created_at.desc())
        .first()
    )
    if not latest:
        return redirect(url_for("questionnaire.start", slug=slug))

    severity = _get_severity_and_recommendations(latest.total_score, addiction.name)
    return render_template(
        "questionnaire/results.html",
        addiction=addiction,
        total_score=latest.total_score,
        severity=severity,
    )
