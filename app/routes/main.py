from flask import Blueprint, render_template
from flask_login import current_user, login_required

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def home():
    return render_template("index.html")


@main_bp.route("/dashboard")
@login_required
def dashboard():
    from app.models import UserResponse
    responses = (
        UserResponse.query.filter_by(user_id=current_user.id)
        .order_by(UserResponse.created_at.desc())
        .all()
    )
    return render_template("dashboard.html", responses=responses)
