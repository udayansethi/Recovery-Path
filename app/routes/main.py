import os
from flask import Blueprint, render_template, request, redirect

main_bp = Blueprint("main", __name__)


def should_redirect_to_vite():
    """Only redirect to Vite frontend if running in local development mode."""
    if os.environ.get("VERCEL"):
        return False
    if request.args.get("legacy"):
        return False
    host = request.host.split(":")[0]
    return host in ("localhost", "127.0.0.1")


@main_bp.route("/")
def home():
    if should_redirect_to_vite():
        return redirect("http://localhost:8080/")

    from app.models import Addiction
    addictions = Addiction.query.all()
    topic_count = len(addictions)
    categories = sorted({a.category for a in addictions})
    question_count = (
        len(addictions[0].questionnaire.questions)
        if addictions and addictions[0].questionnaire
        else 10
    )
    return render_template(
        "index.html",
        topic_count=topic_count,
        categories=categories,
        question_count=question_count,
    )


@main_bp.route("/dashboard")
def dashboard():
    if should_redirect_to_vite():
        return redirect("http://localhost:8080/dashboard")

    from app.models import UserResponse
    from flask_login import current_user
    if not current_user.is_authenticated:
        if should_redirect_to_vite():
            return redirect("http://localhost:8080/dashboard")
        return redirect("/auth/login")

    responses = (
        UserResponse.query.filter_by(user_id=current_user.id)
        .order_by(UserResponse.created_at.desc())
        .all()
    )
    return render_template("dashboard.html", responses=responses)
