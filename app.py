import os
import re
import json
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv

# Explicitly load .env file from the current project directory
env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(dotenv_path=env_path, override=True)

app = Flask(__name__)

# List of known default placeholder key values to ignore
PLACEHOLDER_KEYS = {
    "your_openai_api_key_here",
    "your_gemini_api_key_here",
    "your_api_key_here",
    "your_key_here",
    "dummy_key",
    "none",
    "null"
}

def get_clean_api_key(var_name):
    """Returns the API key if set and not equal to a dummy placeholder string."""
    val = os.getenv(var_name, "").strip()
    if not val or val.lower() in PLACEHOLDER_KEYS:
        return None
    return val


# Feature-specific Prompt Templates
PROMPT_TEMPLATES = {
    "ask": {
        "title": "General Study Q&A",
        "system": "You are StudyMate, an intelligent, patient, and comprehensive AI study assistant capable of answering any academic or technical study question across Python, Java, AI & ML, NLP, Mathematics, Cloud Computing, Distributed Systems, Computer Networks, Data Mining, and all other student subjects.",
        "prompt": """
ROLE:
You are an expert AI study assistant and subject matter tutor.

TASK:
Answer the student's study question or topic accurately, clearly, and thoroughly based on their exact input.

STUDENT INPUT:
{student_input}

INSTRUCTIONS:
1. Directly answer the student's question with complete accuracy and educational clarity.
2. Provide code examples, mathematical formulas, step-by-step logic, or practical diagrams where relevant.
3. Highlight essential technical terms in **bold**.
4. Keep the tone encouraging, clear, and structured for student learning and exam prep.

OUTPUT FORMAT:
## 💡 Answer & Overview
[Direct, clear answer to the student's exact question]

## 🧩 In-Depth Breakdown & Explanation
[Detailed explanation, code block, formula, or concept breakdown]

## 📌 Key Takeaways
[Bullet points of essential concepts to remember]
"""
    },

    "summarize": {
        "title": "Note Summarization",
        "system": "You are StudyMate, a helpful, patient, and highly effective AI study assistant for students.",
        "prompt": """
ROLE:
You are an expert educational AI study assistant specializing in concise note summarization.

TASK:
Summarize the student's study notes into clear, structured, easy-to-read content based on their exact input.

STUDENT INPUT:
{student_input}

INSTRUCTIONS:
1. Identify the core topic and main takeaway in 1-2 sentences.
2. Present key points in clear bullet points using simple, accessible language.
3. Highlight essential terms or vocabulary in **bold**.
4. Keep the summary concise without losing crucial factual details.
5. End with a 1-sentence "Quick Study Tip" or memory aid.

OUTPUT FORMAT:
## 📌 Summary Overview
[1-2 sentence core overview]

## 🔑 Key Points & Concepts
* **Term/Point**: Explanation...
* **Term/Point**: Explanation...

## 💡 Quick Memory Tip
[Actionable memory technique or mnemonic]
"""
    },

    "quiz": {
        "title": "Quiz Generation",
        "system": "You are StudyMate, an expert academic quiz author who creates engaging multiple-choice tests.",
        "prompt": """
ROLE:
You are an AI study assistant and quiz generator.

TASK:
Create a short multiple-choice quiz based directly on the student's provided study material.

STUDENT INPUT:
{student_input}

INSTRUCTIONS:
1. Generate 3 to 4 multiple-choice questions based ONLY on the provided study material.
2. Each question must have 4 choices: (A), (B), (C), (D).
3. Specify the correct answer and a brief student-friendly explanation for why it is correct.
4. Also include a hidden JSON structure at the very end of your response inside a ```json``` block so the StudyMate UI can render an interactive quiz player.

OUTPUT FORMAT:
## 🧪 Practice Quiz

### Question 1: [Question text]
- A) Option A
- B) Option B
- C) Option C
- D) Option D
> **Correct Answer**: [Letter] - [Option text]
> **Explanation**: [Short explanation]

(Repeat for all questions)

At the very end of the response, output this EXACT JSON format inside markdown block:
```json
[
  {
    "question": "Question text...",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 0,
    "explanation": "Explanation..."
  }
]
```
(Note: 'answer' is the 0-based index of the correct option: 0 for A, 1 for B, 2 for C, 3 for D).
"""
    },

    "improve": {
        "title": "Answer Improvement",
        "system": "You are StudyMate, an encouraging academic writing tutor.",
        "prompt": """
ROLE:
You are an AI study assistant and writing coach.

TASK:
Improve a student's weak, incomplete, or poorly worded answer into a polished, high-scoring academic response while maintaining their original intent.

STUDENT INPUT:
{student_input}

INSTRUCTIONS:
1. Correct all spelling, grammar, and sentence structure issues.
2. Make the vocabulary precise and academic, while keeping it suitable for a student.
3. Organize the response logically with clear structure.
4. Preserve the student's original core meaning—do not invent unrelated facts.
5. Provide a constructive breakdown of what was improved and why.

OUTPUT FORMAT:
## ✨ Improved Answer
[Write the enhanced, complete, polished answer here]

## 🔍 Key Improvements Made
- **Grammar & Clarity**: [Explanation of grammar or flow fixes]
- **Structure & Vocabulary**: [Explanation of enhanced terms or structure]

## 🎯 Scoring Impact
[1-2 sentences on why this improved version earns higher marks]
"""
    },

    "explain": {
        "title": "Concept Explanation",
        "system": "You are StudyMate, a master teacher who explains complex ideas in simple, unforgettable ways.",
        "prompt": """
ROLE:
You are an AI study assistant and concept tutor.

TASK:
Explain a complex topic or concept in simple, student-friendly terms based on the student's exact input.

STUDENT INPUT:
{student_input}

INSTRUCTIONS:
1. Explain the concept in plain, simple language avoiding unnecessary jargon.
2. Use a relatable real-world analogy or visual metaphor.
3. Break the concept down into 3-4 simple, digestible steps or parts.
4. Explain "Why this matters" in real life or exam context.
5. Include 1 quick self-check question at the end to test student understanding.

OUTPUT FORMAT:
## 🚀 Simplified Explanation: {student_input}

### 💡 The Big Picture (In Simple Terms)
[Simple explanation]

### 🎨 Analogy Time
[Relatable everyday analogy]

### 🧩 Step-by-Step Breakdown
1. **Step 1**: ...
2. **Step 2**: ...
3. **Step 3**: ...

### ❓ Self-Check Question
[Quick question for the student to reflect on]
"""
    }
}


def call_llm(system_prompt, user_prompt):
    """
    Handles calling the LLM API securely using available environment keys.
    Supports OpenAI API, Gemini API, or generic OpenAI-compatible APIs.
    Filters out empty/placeholder keys to prevent invalid authentication errors.
    """
    openai_key = get_clean_api_key("OPENAI_API_KEY")
    gemini_key = get_clean_api_key("GEMINI_API_KEY") or get_clean_api_key("GOOGLE_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL")
    model_name = os.getenv("LLM_MODEL")

    # 1. Try OpenAI SDK (if valid OPENAI_API_KEY or OPENAI_BASE_URL is present)
    if openai_key or base_url:
        try:
            from openai import OpenAI
            client = OpenAI(
                api_key=openai_key or "dummy_key",
                base_url=base_url if base_url else None
            )
            selected_model = model_name if model_name else "gpt-4o-mini"
            response = client.chat.completions.create(
                model=selected_model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.7,
                max_tokens=1500
            )
            return response.choices[0].message.content
        except Exception as e:
            # If OpenAI fails and a valid Gemini key is also available, try Gemini
            if not gemini_key:
                raise Exception(f"OpenAI API Call Failed: {str(e)}")

    # 2. Try Gemini API (if valid GEMINI_API_KEY / GOOGLE_API_KEY is present)
    if gemini_key:
        from google import genai
        client = genai.Client(api_key=gemini_key)
        full_prompt = f"{system_prompt}\n\n{user_prompt}"

        # Candidate model names to try in order of preference
        candidate_models = [model_name] if model_name else [
            "gemini-3-flash-preview",
            "gemini-flash-latest",
            "gemini-2.5-flash",
            "gemini-1.5-flash"
        ]

        last_error = None
        for m in candidate_models:
            try:
                response = client.models.generate_content(
                    model=m,
                    contents=full_prompt
                )
                return response.text
            except Exception as e:
                last_error = e

        # Fallback to legacy google.generativeai if available
        try:
            import google.generativeai as legacy_genai
            legacy_genai.configure(api_key=gemini_key)
            model = legacy_genai.GenerativeModel('gemini-1.5-flash')
            res = model.generate_content(full_prompt)
            return res.text
        except Exception as leg_err:
            raise Exception(f"Gemini API Call Failed: {str(last_error)} (Legacy fallback: {str(leg_err)})")

    # If no valid API key is configured
    raise Exception(
        "No API Key found! Please set OPENAI_API_KEY or GEMINI_API_KEY in your .env file."
    )


@app.route("/")
def index():
    """Renders the main student dashboard interface."""
    return render_template("index.html")


@app.route("/api/health", methods=["GET"])
def health():
    """Health check endpoint indicating configuration status."""
    has_openai = get_clean_api_key("OPENAI_API_KEY") is not None
    has_gemini = (get_clean_api_key("GEMINI_API_KEY") or get_clean_api_key("GOOGLE_API_KEY")) is not None
    
    provider_status = "None (Requires .env setup)"
    if has_openai:
        provider_status = "OpenAI"
    elif has_gemini:
        provider_status = "Gemini"

    return jsonify({
        "status": "online",
        "configured_provider": provider_status
    })


@app.route("/api/generate", methods=["POST"])
def generate():
    """
    Main API endpoint for AI study operations.
    Receives JSON body: { "feature": string, "content": string }
    """
    try:
        data = request.get_json() or {}
        feature = data.get("feature", "").strip().lower()
        content = data.get("content", "").strip()

        # 1. Validation: Feature check
        if not feature or feature not in PROMPT_TEMPLATES:
            return jsonify({
                "success": False,
                "error": "Invalid study feature selected. Please choose Ask, Summarize, Quiz, Improve, or Explain."
            }), 400

        # 2. Validation: Empty or whitespaces input check
        if not content:
            return jsonify({
                "success": False,
                "error": "Please enter a study question or content before generating an answer."
            }), 400

        # 3. Validation: Minimum length check
        if len(content) < 3:
            return jsonify({
                "success": False,
                "error": "Your input is too short. Please enter a complete phrase or question (at least 3 characters)."
            }), 400

        # 4. Prompt construction safely using string replace
        template = PROMPT_TEMPLATES[feature]
        system_prompt = template["system"]
        formatted_user_prompt = template["prompt"].replace("{student_input}", content)

        # 5. Call LLM API securely
        result_text = call_llm(system_prompt, formatted_user_prompt)

        return jsonify({
            "success": True,
            "feature": feature,
            "feature_name": template["title"],
            "result": result_text
        })

    except Exception as e:
        error_msg = str(e)
        clean_error = "Sorry, we couldn't generate a response right now. Please try again."
        
        lower_err = error_msg.lower()
        if "no api key found" in lower_err:
            clean_error = "API key missing! Please set OPENAI_API_KEY or GEMINI_API_KEY in your .env file."
        elif "invalid_api_key" in lower_err or "incorrect api key" in lower_err or "api key not valid" in lower_err or "authentication" in lower_err:
            clean_error = "Invalid API key! Please check that your OPENAI_API_KEY or GEMINI_API_KEY in .env is valid."
        elif "quota" in lower_err or "rate" in lower_err or "429" in lower_err:
            clean_error = "API rate limit or quota exceeded. Please wait a moment or check your API account."

        return jsonify({
            "success": False,
            "error": clean_error,
            "details": error_msg if os.getenv("FLASK_ENV") == "development" else None
        }), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") == "development"
    print(f"[StudyMate] AI Assistant running on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
