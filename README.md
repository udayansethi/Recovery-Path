# Recovery Path

A Flask web app that helps users explore addiction types, complete questionnaires, and receive personalized guidance. Built with Python, Flask, SQLAlchemy, and Flask-Login.

## Features

- **User accounts** — Register, log in, and track your progress
- **Addiction catalog** — Browse and search topics across Substance, Behavioral, and Health categories
- **Questionnaires** — Answer 10 questions per topic (1–5 scale)
- **Personalized results** — Get tips and recommendations based on your score
- **Dashboard** — View past questionnaire results
- **Community Stories** — Read and share personal experiences and recovery journeys

## Addiction Types Covered

### Substance Addictions (5 each)
- Alcohol - 5 sample stories
- Smoking / Nicotine - 5 sample stories
- Caffeine - 5 sample stories
- Marijuana / Cannabis - 5 sample stories
- Opioids / Painkillers - 5 sample stories
- Cocaine / Stimulants - 5 sample stories

### Behavioral Addictions (5 each)
- Social Media & Screens - 5 sample stories
- Gaming - 5 sample stories
- Shopping / Spending - 5 sample stories
- Gambling - 5 sample stories
- Pornography / Sexual Content - 5 sample stories
- Work / Career - 5 sample stories
- Internet / Online Activities - 5 sample stories
- Love / Relationships - 5 sample stories

### Health-Related Addictions (5 each)
- Food / Eating - 5 sample stories
- Sugar / Sweets - 5 sample stories
- Exercise - 5 sample stories

**Total: 17 addiction types with 85+ authentic recovery stories**

## Setup

1. Create and activate a virtual environment:

   ```
   python -m venv venv
   venv\Scripts\activate   # Windows
   # or: source venv/bin/activate  # macOS/Linux
   ```

2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. (Optional) Set environment variables in a `.env` file:

   ```
   SECRET_KEY=your-secret-key
   DATABASE_URL=sqlite:///addiction_support.db
   ```

4. Run the app:

   ```
   python run.py
   ```

5. Open http://127.0.0.1:5000 in your browser.

## Project Structure

```
├── app/
│   ├── __init__.py       # App factory
│   ├── models.py         # User, Addiction, Questionnaire, Question, UserResponse
│   ├── forms.py          # Registration, Login
│   ├── routes/           # Auth, main, addictions, questionnaire
│   ├── templates/        # Jinja2 templates
│   ├── static/css/       # Styles
│   └── utils/seed.py     # Seed addiction data
├── config.py
├── run.py
└── requirements.txt
```

## Disclaimer

This tool is for informational purposes only and does not replace professional medical or psychological advice. If you're in crisis, please contact a helpline or healthcare provider.
