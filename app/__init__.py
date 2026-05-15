import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

from config import Config

db = SQLAlchemy()
login_manager = LoginManager()


def create_app(config_class=Config):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    app = Flask(
        __name__,
        template_folder=os.path.join(base_dir, "templates"),
        static_folder=os.path.join(base_dir, "static"),
        static_url_path="/static",
    )
    app.config.from_object(config_class)

    db.init_app(app)
    login_manager.init_app(app)
    login_manager.login_view = "auth.login"
    login_manager.login_message = "Please log in to access this page."

    from app.routes.auth import auth_bp
    from app.routes.main import main_bp
    from app.routes.addictions import addictions_bp
    from app.routes.questionnaire import questionnaire_bp
    from app.routes.tracking import tracking_bp

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(main_bp)
    app.register_blueprint(addictions_bp, url_prefix="/addictions")
    app.register_blueprint(questionnaire_bp, url_prefix="/questionnaire")
    app.register_blueprint(tracking_bp, url_prefix="/tracking")

    with app.app_context():
        db.create_all()
        from app.utils.seed import seed_db
        seed_db()

    return app
