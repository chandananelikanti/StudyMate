# StudyMate – AI Student Utility Assistant

> **A Complete AI-Powered Student Productivity Web Application**  
> *Built as a Beginner-Level AI Engineer Internship Project*

---

## 1. Project Title
**StudyMate – AI Student Utility Assistant**

---

## 2. Project Objective
The primary objective of **StudyMate** is to build a practical, accessible, and high-value AI utility for students. Rather than acting as a generic chatbot, StudyMate leverages modern Large Language Model (LLM) APIs with structured prompt engineering to help students execute four fundamental academic workflows:
1. **Note Summarization**: Transform lengthy lecture notes into concise key points.
2. **Quiz Generation**: Instantly create practice multiple-choice quizzes from study materials.
3. **Answer Improvement**: Refine weak or unpolished student writing for better clarity and grammar.
4. **Concept Explanation**: Simplify dense, difficult concepts using everyday analogies.

---

## 3. Problem Statement
Students frequently face information overload, dense study materials, and difficulty organizing complex topics before exams. Generic AI chatbots often provide verbose, unstructured responses that require additional prompting to be useful for studying. Furthermore, beginners learning AI engineering need clear, non-overengineered reference implementations showing how to connect a modern web frontend (HTML/CSS/JS) to a lightweight backend (Flask) while managing LLM prompt templates, input validation, and API keys securely.

**StudyMate resolves this by providing:**
- A dedicated, task-focused user interface designed specifically for students.
- Structured system and user prompts engineered for optimal educational outputs.
- An interactive practice quiz player and accessibility tools (speech synthesis, 1-click presets).
- Secure, environment-driven API key handling preventing client-side leakages.

---

## 4. Key Features

### 📝 Feature 1: Note Summarization
- **Purpose**: Condenses verbose lecture notes or textbook passages into digestible study summaries.
- **Output**: Core summary overview, bulleted key concepts with bolded vocabulary, and quick memory tips.

### 🧪 Feature 2: Quiz Generation & Interactive Quiz Player
- **Purpose**: Converts study content into multiple-choice test questions.
- **Output**: Formatted markdown quiz questions with options A–D, correct answers, and explanations.
- **Bonus UI Feature**: Parses JSON output to render an **interactive clickable quiz component** in the browser with instant scoring and explanation popups.

### ✨ Feature 3: Answer Improvement
- **Purpose**: Helps students refine short-answer responses before submission or review.
- **Output**: Polished academic draft, bulleted list of specific grammar/clarity fixes made, and a scoring impact summary.

### 🚀 Feature 4: Concept Explanation
- **Purpose**: Explains complex or technical terms in plain language.
- **Output**: Simplified overview, relatable everyday analogy, step-by-step breakdown, and a self-check reflection question.

### 🎨 Additional Interface & Utility Features
- **Preset Sample Loader**: 1-click preset sample inputs for instant evaluation of all 4 features.
- **Dark / Light Theme Toggle**: Sleek glassmorphism UI with smooth theme switching.
- **Speech Synthesis (Read Aloud)**: Browser-native voice readout for auditory learners.
- **Export & Clipboard**: Copy response to clipboard or download as a `.txt` file.

---

## 5. Technology Used

| Component | Technology | Description |
|---|---|---|
| **Frontend UI** | HTML5, CSS3, JavaScript (ES6+) | Clean, responsive UI with CSS variables & glassmorphism |
| **Markdown Parsing** | Marked.js | Renders structured AI markdown output in real time |
| **Icons & Fonts** | FontAwesome 6, Google Fonts | Outfit & Plus Jakarta Sans typography |
| **Backend API** | Python 3.10+, Flask 3.0 | Lightweight REST API server handling request routes |
| **AI Integration** | `openai` SDK, `google-genai` SDK | Secure integration with OpenAI (GPT-4o-mini) and Gemini |
| **Config Management** | `python-dotenv` | Loads environment variables securely from `.env` |

---

## 6. Project Structure

```text
StudyMate/
│
├── app.py                  # Main Flask application & prompt engineering logic
├── requirements.txt        # Python dependency manifest
├── .env                    # Local environment variables (API keys - Git ignored)
├── .env.example            # Environment setup template
├── .gitignore              # Files ignored by Git repository
├── README.md               # Project documentation & requirement validation
│
├── templates/
│   └── index.html          # Main HTML5 application view
│
└── static/
    ├── style.css           # Modern CSS styling system & dark/light themes
    └── script.js           # Frontend interactivity, API fetching & quiz engine
```

---

## 7. How the Application Works

```text
Student Opens App (index.html)
        ↓
Selects Study Feature (Summarize / Quiz / Improve / Explain)
        ↓
Enters Study Material or Clicks "Load Sample Input"
        ↓
Frontend Validates Input (Prevents empty/short requests)
        ↓
POST Request sent to Flask Backend (/api/generate)
        ↓
app.py injects input into Feature-Specific Prompt Template
        ↓
Backend securely calls LLM API (OpenAI / Gemini) via API Key
        ↓
LLM returns generated response
        ↓
Backend returns JSON response to Frontend
        ↓
Frontend renders formatted Markdown & Interactive Quiz
```

---

## 8. AI API Setup

StudyMate is designed to work seamlessly with either **OpenAI** or **Google Gemini** LLM APIs.

### Option A: OpenAI API Setup
1. Sign up or log into [OpenAI Platform](https://platform.openai.com/).
2. Navigate to **API Keys** and click **Create new secret key**.
3. Copy your secret key (`sk-...`).

### Option B: Google Gemini API Setup (Free Tier Available)
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key** and generate a new key.
3. Copy your Gemini key (`AIza...`).

---

## 9. Environment Variable Setup

1. Locate `.env.example` in the project root.
2. Create a new file named `.env` in the same directory (or copy `.env.example` to `.env`).
3. Add your API key:

```env
# For OpenAI:
OPENAI_API_KEY=your_actual_openai_api_key_here

# OR For Google Gemini:
GEMINI_API_KEY=your_actual_gemini_api_key_here

# Server settings
PORT=5000
FLASK_ENV=development
```

> **Security Note**: Never commit the `.env` file to version control. It is listed in `.gitignore` to keep your API keys safe.

---

## 10. Installation Steps

### Prerequisites
- Python 3.9+ installed on your system.
- Git installed (optional).

### Step 1: Open Terminal / Command Prompt
Navigate to the `StudyMate` project directory:
```bash
cd StudyMate
```

### Step 2: Create a Virtual Environment (Recommended)
```bash
# On Windows:
python -m venv venv
venv\Scripts\activate

# On macOS/Linux:
python3 -m venv venv
source venv/bin/activate
```

### Step 3: Install Required Dependencies
```bash
pip install -r requirements.txt
```

---

## 11. How to Run the Project

### Step 1: Ensure `.env` is configured with your API key.

### Step 2: Start the Flask Application
```bash
python app.py
```

### Step 3: Open in Browser
Open your Web Browser and navigate to:
```text
http://127.0.0.1:5000
```

---

## 12. Explanation of the Four AI Features

1. **Note Summarization (`summarize`)**: Focuses on distillation. It extracts core definitions, removes fluff, bolding critical terms so students can scan long chapters in under 30 seconds.
2. **Quiz Generation (`quiz`)**: Focuses on active recall testing. It creates objective standard multiple-choice questions with answer keys, explanations, and embedded JSON data for live UI testing.
3. **Answer Improvement (`improve`)**: Focuses on writing feedback. It acts as an essay coach, taking a student's informal idea and showing them how to express it with proper academic terminology.
4. **Concept Explanation (`explain`)**: Focuses on conceptual clarity. It uses analogy-based teaching ("Explain Like I'm 5") so students grasp difficult mechanisms before memorizing technical terms.

---

## 13. Prompt Design Explanation

StudyMate avoids generic "chat" prompts. Each feature utilizes a structured, role-defined template in `app.py`:

```text
ROLE:
You are an AI study assistant specializing in [Specific Task].

TASK:
Perform [Selected Study Action] on the provided input.

STUDENT INPUT:
{student_input}

INSTRUCTIONS:
1. Follow precise formatting guidelines.
2. Use simple, student-friendly language.
3. Keep the output clean, structured, and actionable.

OUTPUT FORMAT:
[Explicit Markdown Structure Required]
```

### Why this structure works:
- **Role Definition**: Constraints the LLM's persona to an encouraging, precise tutor.
- **Explicit Instructions**: Guarantees consistent section headers (`## 📌 Overview`, `## 🔑 Key Points`) for easy frontend rendering.
- **Output Anchoring**: Prevents conversational fluff like *"Sure, here is your summary:"* and returns immediate study content.

---

## 14. Input Validation

Input validation is enforced on both the **Frontend** and **Backend**:

1. **Frontend Validation (`script.js`)**:
   - Detects empty or whitespace-only inputs.
   - Prevents sending API requests if the text length is under 3 characters.
   - Displays a clean error banner (`#alertBanner`) without interrupting the user experience.

2. **Backend Validation (`app.py`)**:
   - Checks if `feature` parameter matches supported keys (`summarize`, `quiz`, `improve`, `explain`).
   - Checks if `content` is missing or empty.
   - Returns a `400 Bad Request` JSON response with friendly error messages.

---

## 15. Error Handling

StudyMate implements defensive programming to handle runtime failures gracefully:

- **Missing API Key**: If no `.env` key is provided, the backend returns a friendly warning explaining how to set up `.env`.
- **API Failure / Rate Limits**: API exceptions are caught and sanitized so technical secrets or raw backtraces are never exposed to the user UI.
- **Network Failures**: Frontend catches fetch errors and alerts the user to check their internet connection.
- **Invalid Response**: If the LLM returns unstructured output, the fallback text parser safely displays the markdown without breaking the UI.

---

## 16. Future Improvements

- 📄 **PDF / File Upload Support**: Allow students to upload PDF textbooks or lecture slides directly.
- 🎴 **Flashcard Export**: Export summaries directly to Anki or Quizlet flashcard formats.
- 📜 **Study History**: Save recent summaries and quiz scores to local storage or browser database.
- 🎙️ **Voice Notes Input**: Allow students to dictate notes using browser Speech-to-Text.

---

## 📋 How This Project Meets the Beginner Internship Requirements

| Requirement | Implementation Detail | Status |
|---|---|---|
| **1. Feature 1: Note Summarization** | Implemented concise summarization with bullet points & bolded vocabulary in `app.py` prompt templates | ✅ Complete |
| **2. Feature 2: Quiz Generation** | Implemented multiple-choice quiz generator with interactive clickable test component in UI | ✅ Complete |
| **3. Feature 3: Answer Improvement** | Implemented grammar correction & academic tone polishing with change breakdowns | ✅ Complete |
| **4. Feature 4: Concept Explanation** | Implemented plain language explanation with everyday analogies & self-check questions | ✅ Complete |
| **5. Student-Friendly UI** | Built clean, responsive HTML/CSS interface with feature selector, textarea, theme toggle & utilities | ✅ Complete |
| **6. Real LLM API Integration** | Connected backend to OpenAI / Gemini LLM API via secure HTTP/SDK integration in `app.py` | ✅ Complete |
| **7. Secure Key Handling** | Used `.env` and `python-dotenv` for API keys; added `.env` to `.gitignore` and created `.env.example` | ✅ Complete |
| **8. Structured Prompts** | Created 4 distinct, role-defined prompt templates in `app.py` (No generic chatbot prompts) | ✅ Complete |
| **9. Input Validation** | Validates empty inputs and short inputs on both JS frontend and Flask backend | ✅ Complete |
| **10. Error Handling** | Catches missing API keys, quota issues, and network errors gracefully without app crashes | ✅ Complete |
| **11. Simple Tech Stack** | Built using beginner-friendly stack: HTML, CSS, Vanilla JS, Python Flask, `.env` | ✅ Complete |
| **12. Clean Directory Structure** | Follows modular structure: `app.py`, `templates/`, `static/`, `requirements.txt`, `.env.example`, `.gitignore` | ✅ Complete |
| **13. Output Display** | Formatted output rendered with Markdown headings, bullet points, interactive quiz player & text-to-speech | ✅ Complete |
| **14. Comprehensive README** | Includes objective, architecture, prompt design, setup guide, and internship verification checklist | ✅ Complete |

---

*Made with ❤️ for students preparing for AI Engineering Internship success.*
