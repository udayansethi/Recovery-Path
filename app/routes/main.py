from flask import Blueprint, render_template, request, redirect

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def home():
    if not request.args.get("legacy"):
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
    if not request.args.get("legacy"):
        return redirect("http://localhost:8080/dashboard")

    from app.models import UserResponse
    from flask_login import current_user
    if not current_user.is_authenticated:
        return redirect("http://localhost:8080/dashboard")

    responses = (
        UserResponse.query.filter_by(user_id=current_user.id)
        .order_by(UserResponse.created_at.desc())
        .all()
    )
    return render_template("dashboard.html", responses=responses)
