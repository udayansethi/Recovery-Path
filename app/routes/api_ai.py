import logging
from flask import Blueprint, request, jsonify
from flask_login import current_user
from app.services.ai_service import AIService
from app.models import Addiction, UserResponse, AddictionTrackingEntry

logger = logging.getLogger(__name__)

api_ai_bp = Blueprint("api_ai", __name__, url_prefix="/api/ai")
ai_service = AIService()


@api_ai_bp.route("/chat", methods=["POST"])
def chat():
    """
    Endpoint for the Hope AI recovery companion.
    Accepts JSON payload with list of conversation messages.
    """
    data = request.get_json() or {}
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"reply": "Hello! I'm Hope, your recovery companion. How are you feeling today?", "is_crisis": False})

    # Prepare safe, anonymized user context if logged in
    user_context = {}
    if current_user.is_authenticated:
        latest_entry = (
            AddictionTrackingEntry.query.filter_by(user_id=current_user.id)
            .order_by(AddictionTrackingEntry.entry_date.desc())
            .first()
        )
        if latest_entry and latest_entry.addiction:
            user_context["addiction"] = latest_entry.addiction.name

    try:
        response = ai_service.chat_companion(messages, user_context)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        return jsonify({
            "is_crisis": False,
            "reply": "I am here with you. Take a slow, gentle breath. Remember that you are taking positive steps one day at a time."
        })


@api_ai_bp.route("/assessment-advice", methods=["POST"])
def assessment_advice():
    """
    Endpoint to generate personalized AI advice for completed questionnaires.
    """
    data = request.get_json() or {}
    addiction_name = data.get("addiction_name", "General Wellness")
    total_score = data.get("total_score", 0)
    severity_level = data.get("severity_level", "Moderate")
    answers_summary = data.get("answers_summary", "Completed 10 self-assessment questions.")

    try:
        response = ai_service.get_assessment_advice(
            addiction_name=addiction_name,
            total_score=total_score,
            severity_level=severity_level,
            answers_summary=answers_summary
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in assessment advice endpoint: {e}")
        return jsonify({
            "advice": (
                f"### Understanding Your Score\n"
                f"Your assessment score for **{addiction_name}** indicates a **{severity_level.title()}** pattern. "
                f"Recognizing where you are today is a vital and courageous first step.\n\n"
                f"### Action Steps\n"
                f"1. **Track Your Triggers:** Pay attention to situations or feelings that spark urges.\n"
                f"2. **Small Daily Goals:** Aim for gradual, manageable improvements.\n"
                f"3. **Reach Out:** Connect with supportive friends or recovery resources."
            ),
            "addiction": addiction_name,
            "severity": severity_level
        })


@api_ai_bp.route("/entry-tip", methods=["POST"])
def entry_tip():
    """
    Endpoint to get an instant AI reflection & coping tip for a tracking log.
    """
    data = request.get_json() or {}
    entry_type = data.get("entry_type", "trigger")
    severity = int(data.get("severity", 3))
    notes = data.get("notes", "")
    addiction_name = data.get("addiction_name", "")

    try:
        response = ai_service.get_entry_coping_tip(
            entry_type=entry_type,
            severity=severity,
            notes=notes,
            addiction_name=addiction_name
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in entry tip endpoint: {e}")
        return jsonify({
            "is_crisis": False,
            "tip": "**Reflection:** Being honest about how you feel is true courage.\n\n**Quick Coping Action:** Take 5 slow, deep breaths and drink a glass of water. Urges naturally fade in 15 minutes."
        })


@api_ai_bp.route("/sos-grounding", methods=["POST"])
def sos_grounding():
    """
    Emergency SOS Craving De-escalator endpoint with 5-4-3-2-1 sensory grounding.
    """
    data = request.get_json() or {}
    addiction_name = data.get("addiction_name", "your recovery journey")
    urge_level = int(data.get("urge_level", 5))

    try:
        response = ai_service.get_sos_grounding(addiction_name=addiction_name, urge_level=urge_level)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in SOS grounding endpoint: {e}")
        return jsonify({
            "grounding": "### 🌊 Urge Surfing\nTake 3 slow deep breaths. Remember that cravings peak within 15 minutes and will naturally pass.\n\n### 5-4-3-2-1 Sensory Grounding\nLook around and name 5 objects you see, 4 textures you feel, 3 sounds you hear, 2 sensations, and 1 slow breath.",
            "addiction": addiction_name,
            "urge_level": urge_level
        })


@api_ai_bp.route("/refusal-script", methods=["POST"])
def refusal_script():
    """
    Refusal practice roleplay script generator (Saying 'No').
    """
    data = request.get_json() or {}
    addiction_name = data.get("addiction_name", "substance or habit")
    scenario = data.get("scenario", "social gathering / party")

    try:
        response = ai_service.get_refusal_script(addiction_name=addiction_name, scenario=scenario)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in refusal script endpoint: {e}")
        return jsonify({
            "scripts": "### 1. Casual\n*\"I'm good for now with soda, thanks!\"*\n\n### 2. Health\n*\"Taking a 30-day health reset!\"*\n\n### 3. Firm\n*\"I've quit completely, thanks for respecting that!\"*"
        })


@api_ai_bp.route("/decompose-goal", methods=["POST"])
def decompose_goal():
    """
    Breaks down a broad recovery goal into 3 daily micro-habits.
    """
    data = request.get_json() or {}
    goal_title = data.get("goal_title", "")
    goal_type = data.get("goal_type", "reduction")
    addiction_name = data.get("addiction_name", "recovery")

    try:
        response = ai_service.decompose_goal(
            goal_title=goal_title,
            goal_type=goal_type,
            addiction_name=addiction_name
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in decompose goal endpoint: {e}")
        return jsonify({
            "breakdown": "### 🎯 3 Daily Micro-Habits\n1. **Environment Swap:** Remove triggers from reach.\n2. **Routine Shift:** Replace peak urge time with a positive alternative.\n3. **Nightly Log:** Spend 1 minute logging your day."
        })


@api_ai_bp.route("/milestone-letter", methods=["POST"])
def milestone_letter():
    """
    Generates an empowering Milestone Shield Letter celebrating progress.
    """
    data = request.get_json() or {}
    milestone_title = data.get("milestone_title", "7 Days Clean")
    days_clean = int(data.get("days_clean", 7))
    addiction_name = data.get("addiction_name", "Recovery")

    try:
        response = ai_service.generate_milestone_shield(
            milestone_title=milestone_title,
            days_clean=days_clean,
            addiction_name=addiction_name
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in milestone letter endpoint: {e}")
        return jsonify({
            "letter": f"Dear Future Me,\n\nAchieving **{milestone_title}** in {addiction_name} is living proof of your strength. When future urges appear, remember how much peace you earned today."
        })


@api_ai_bp.route("/pattern-insights", methods=["POST"])
def pattern_insights():
    """
    Analyzes logged tracking entries and surfaces peak trigger patterns.
    """
    data = request.get_json() or {}
    entries_summary = data.get("entries_summary", "")
    addiction_name = data.get("addiction_name", "General Recovery")

    try:
        response = ai_service.analyze_trigger_patterns(
            entries_summary=entries_summary,
            addiction_name=addiction_name
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in pattern insights endpoint: {e}")
        return jsonify({
            "analysis": "### 🔍 Pattern Digest\n• Urges often concentrate around evening stress.\n• Proactive tracking correlates with faster recovery momentum."
        })


@api_ai_bp.route("/evening-wind-down", methods=["POST"])
def evening_wind_down():
    """
    Generates a 2-minute sleep and bedtime somatic calming script.
    """
    data = request.get_json() or {}
    addiction_name = data.get("addiction_name", "")

    try:
        response = ai_service.get_evening_wind_down(addiction_name=addiction_name)
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in evening wind down endpoint: {e}")
        return jsonify({
            "script": "### 🌙 Bedtime Somatic Calming\n1. Relax your shoulders and unclench your jaw.\n2. Inhale for 4 seconds, exhale for 8 seconds.\n3. You are safe, healing, and ready for restful sleep."
        })


@api_ai_bp.route("/story-takeaways", methods=["POST"])
def story_takeaways():
    """
    Extracts key lessons and trigger tags from recovery stories.
    """
    data = request.get_json() or {}
    story_content = data.get("story_content", "")
    addiction_name = data.get("addiction_name", "")

    try:
        response = ai_service.summarize_story_lessons(
            story_content=story_content,
            addiction_name=addiction_name
        )
        return jsonify(response)
    except Exception as e:
        logger.error(f"Error in story takeaways endpoint: {e}")
        fallback_text = "### Key Strategies That Worked:\n• Taking recovery one hour at a time.\n• Building a support shield with friends."
        return jsonify({
            "takeaways": fallback_text,
            "summary": fallback_text
        })

