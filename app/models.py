from datetime import datetime
from app import db, login_manager
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class User(UserMixin, db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    responses = db.relationship("UserResponse", backref="user", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Addiction(db.Model):
    __tablename__ = "addictions"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, index=True)
    slug = db.Column(db.String(100), unique=True, nullable=False, index=True)
    category = db.Column(db.String(50), nullable=False, index=True)
    description = db.Column(db.Text, nullable=False)
    icon = db.Column(db.String(50), default="help-circle")

    questionnaire = db.relationship(
        "Questionnaire", backref="addiction", uselist=False, lazy="joined"
    )
    stories = db.relationship("AddictionStory", backref="addiction", lazy="dynamic", order_by="AddictionStory.created_at.desc()")


class Questionnaire(db.Model):
    __tablename__ = "questionnaires"

    id = db.Column(db.Integer, primary_key=True)
    addiction_id = db.Column(db.Integer, db.ForeignKey("addictions.id"), nullable=False)

    questions = db.relationship(
        "Question", backref="questionnaire", lazy="joined", order_by="Question.order"
    )
    user_responses = db.relationship("UserResponse", backref="questionnaire", lazy="dynamic")


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    questionnaire_id = db.Column(
        db.Integer, db.ForeignKey("questionnaires.id"), nullable=False
    )
    text = db.Column(db.Text, nullable=False)
    question_type = db.Column(db.String(20), default="scale")  # scale, multiple_choice, yes_no
    options = db.Column(db.JSON, nullable=True)  # For multiple choice: ["option1", "option2"]
    order = db.Column(db.Integer, default=0)


class UserResponse(db.Model):
    __tablename__ = "user_responses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    questionnaire_id = db.Column(
        db.Integer, db.ForeignKey("questionnaires.id"), nullable=False
    )
    answers = db.Column(db.JSON, nullable=False)  # {question_id: answer}
    total_score = db.Column(db.Integer, default=0)
    severity_level = db.Column(db.String(30), default="low")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class AddictionStory(db.Model):
    __tablename__ = "addiction_stories"

    id = db.Column(db.Integer, primary_key=True)
    addiction_id = db.Column(db.Integer, db.ForeignKey("addictions.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)  # Can be anonymous
    author_name = db.Column(db.String(100), nullable=False)  # For anonymous posts
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    is_anonymous = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_sample = db.Column(db.Boolean, default=False)  # For seeded sample stories

    user = db.relationship("User", backref="stories", lazy="joined")


class AddictionTrackingEntry(db.Model):
    __tablename__ = "addiction_tracking_entries"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    addiction_id = db.Column(db.Integer, db.ForeignKey("addictions.id"), nullable=False)
    entry_date = db.Column(db.Date, nullable=False, index=True)
    entry_type = db.Column(db.String(20), nullable=False)  # 'relapse', 'trigger', 'progress', 'milestone'
    description = db.Column(db.Text, nullable=True)  # What happened
    quantity = db.Column(db.String(100), nullable=True)  # How much (e.g., "2 drinks", "3 hours gaming")
    severity = db.Column(db.Integer, default=1)  # 1-5 scale
    notes = db.Column(db.Text, nullable=True)  # Additional notes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="tracking_entries", lazy="joined")
    addiction = db.relationship("Addiction", backref="tracking_entries", lazy="joined")


class AddictionGoal(db.Model):
    __tablename__ = "addiction_goals"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    addiction_id = db.Column(db.Integer, db.ForeignKey("addictions.id"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    target_date = db.Column(db.Date, nullable=True)
    goal_type = db.Column(db.String(20), nullable=False)  # 'abstinence', 'reduction', 'frequency', 'milestone'
    target_value = db.Column(db.String(100), nullable=True)  # e.g., "0 drinks", "under 2 hours daily"
    is_active = db.Column(db.Boolean, default=True)
    is_completed = db.Column(db.Boolean, default=False)
    completed_date = db.Column(db.Date, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = db.relationship("User", backref="goals", lazy="joined")
    addiction = db.relationship("Addiction", backref="goals", lazy="joined")
