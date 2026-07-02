import os
import json
import requests
from django.conf import settings

OLLAMA_URL = os.environ.get('OLLAMA_URL', 'http://localhost:11434')
DEFAULT_MODEL = os.environ.get('OLLAMA_MODEL', 'gemma') # Default local model

HAS_AI_LIBS = False
print("[AI HELPER] AI ML libs disabled for Free Tier. Using pure Python fallbacks.")

# ----------------- Pure Python Fallback Helpers -----------------
class FallbackVectorDB:
    """A lightweight, pure-Python vector database using simple text token overlap cosine-similarity."""
    def __init__(self):
        self.documents = []
        self.metadata = []
        self.ids = []

    def add(self, document, metadata, doc_id):
        self.documents.append(document)
        self.metadata.append(metadata)
        self.ids.append(doc_id)

    def query(self, query_text, n_results=3):
        # A simple token-intersection based mock score for similarity search
        query_tokens = set(query_text.lower().split())
        results = []
        for index, doc in enumerate(self.documents):
            doc_tokens = set(doc.lower().split())
            intersection = query_tokens.intersection(doc_tokens)
            score = len(intersection) / float(max(1, len(query_tokens) + len(doc_tokens) - len(intersection)))
            results.append((score, doc, self.metadata[index], self.ids[index]))
            
        # Sort by score descending
        results.sort(key=lambda x: x[0], reverse=True)
        
        ret_docs = [item[1] for item in results[:n_results]]
        ret_meta = [item[2] for item in results[:n_results]]
        ret_ids = [item[3] for item in results[:n_results]]
        return {'documents': [ret_docs], 'metadatas': [ret_meta], 'ids': [ret_ids]}

# Global fallback vector DB instance
_fallback_db = FallbackVectorDB()

import google.generativeai as genai

# Setup Gemini using API Key from Render environment variables
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    
def generate_ollama_response(prompt, system_prompt=None, response_format=None):
    """
    Sends requests to the Google Gemini API (replaces old local Ollama).
    """
    if not GEMINI_API_KEY:
        print("[GEMINI] No GEMINI_API_KEY found in environment variables. Falling back to mock.")
        return ""
        
    try:
        # We use gemini-1.5-flash as it is extremely fast and generous on the free tier
        model = genai.GenerativeModel('gemini-1.5-flash', system_instruction=system_prompt)
        
        # Configure output format if requested
        generation_config = genai.types.GenerationConfig()
        if response_format == "json":
            generation_config.response_mime_type = "application/json"
            
        response = model.generate_content(prompt, generation_config=generation_config)
        return response.text.strip()
    except Exception as e:
        print(f"[GEMINI] Connection failed: {str(e)}")
        
    return ""

# ----------------- Structured AI Generators -----------------
def ai_generate_quiz(subject_name):
    """
    Generates a structured 5-question MCQ quiz on a given subject.
    Returns JSON.
    """
    system_prompt = "You are an expert professor. You must output a JSON object containing a list of 5 MCQ questions. Do not write markdown blocks or text wrapper. Example: { \"questions\": [ { \"question\": \"q1\", \"options\": [\"o1\", \"o2\", \"o3\", \"o4\"], \"correct\": 1 } ] }"
    prompt = f"Generate a 5-question MCQ quiz on the subject of '{subject_name}' for engineering/college level."
    
    response = generate_ollama_response(prompt, system_prompt=system_prompt, response_format="json")
    try:
        if response:
            return json.loads(response)
    except Exception:
        pass
        
    # Python Mock Fallback if Ollama fails
    return {
        "questions": [
            {
                "question": f"Which of the following is a core concept in {subject_name}?",
                "options": ["Abstraction", "Inheritance", "Polymorphism", "All of the above"],
                "correct": 4
            },
            {
                "question": f"What is the primary objective of studying {subject_name}?",
                "options": ["Theoretical analysis", "Practical design", "Problem solving", "All of the above"],
                "correct": 4
            },
            {
                "question": f"Who is considered one of the primary pioneers in the field of {subject_name}?",
                "options": ["Alan Turing", "Grace Hopper", "Ada Lovelace", "Charles Babbage"],
                "correct": 1
            },
            {
                "question": "Which layer or level deals with execution directly?",
                "options": ["Application Layer", "System Layer", "Hardware Layer", "User Layer"],
                "correct": 3
            },
            {
                "question": "What is the standard methodology for testing systems?",
                "options": ["Unit testing", "Integration testing", "System testing", "All of the above"],
                "correct": 4
            }
        ]
    }

def ai_generate_question_paper(subject_name, total_marks=50):
    """
    Generates a structured exam question paper.
    """
    system_prompt = "You are an examiner. Generate a complete and professional college examination question paper. Format the paper with section titles and mark distributions."
    prompt = f"Generate an examination paper for the subject of '{subject_name}' totaling {total_marks} marks. Include multiple sections like Section A (Short questions), Section B (Analytical questions), and Section C (Comprehensive design questions)."
    
    response = generate_ollama_response(prompt, system_prompt=system_prompt)
    if response:
        return response
        
    # Mock Question Paper Fallback
    return f"""
    🎓 SIR SITARAM AND LADY SHANTABAI PATKAR COLLEGE (AUTONOMOUS)
    ---------------------------------------------------------
    SEMESTER EXAMINATION | SUBJECT: {subject_name.upper()}
    TIME: 2 HOURS        | TOTAL MARKS: {total_marks}
    ---------------------------------------------------------
    
    SECTION A: SHORT ANSWER QUESTIONS (10 Marks)
    Answer any 5 questions. (2 Marks each)
    1. Define the core parameters governing {subject_name}.
    2. Draw a block diagram showing the interface flow.
    3. State the difference between static and dynamic analysis.
    4. List two applications of {subject_name} in modern industry.
    5. What is the role of efficiency in this system?
    
    SECTION B: DETAILED ANALYSIS (20 Marks)
    Answer any 2 questions. (10 Marks each)
    6. Formulate a comprehensive algorithm to resolve bottleneck issues.
    7. Compare and contrast standard methodologies vs modern methodologies.
    8. Discuss the design principles of scaling {subject_name} setups.
    
    SECTION C: DESIGN & CHALLENGES (20 Marks)
    Compulsory question. (20 Marks)
    9. Design a full architectural plan for integrating a {subject_name} framework within a live enterprise workflow. Focus on security, safety protocols, and fail-safe structures.
    """

def ai_generate_timetable(course_name, subjects):
    """
    Generates an optimized weekly timetable schedule.
    """
    system_prompt = "You are a college coordinator. Output an optimized weekly slot arrangement in plain text."
    prompt = f"Arrange a weekly lecture schedule for '{course_name}' involving the following subjects: {', '.join(subjects)}. Generate slots from Monday to Friday (9:00 AM - 1:00 PM)."
    
    response = generate_ollama_response(prompt, system_prompt=system_prompt)
    if response:
        return response
        
    # Mock Timetable Fallback
    lines = []
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    import random
    for day in days:
        lines.append(f"📅 {day}:")
        random.shuffle(subjects)
        for idx, sub in enumerate(subjects[:3]):
            start_time = f"{9 + idx}:00 AM"
            end_time = f"{10 + idx}:00 AM"
            lines.append(f"  • {start_time} - {end_time} : {sub} (Room {101 + idx})")
    return "\n".join(lines)

def ai_generate_resume(profile_data):
    """
    Generates a structured, professional markdown resume based on user profiles.
    """
    system_prompt = "You are a professional resume writer. Structure the inputs into an executive markdown profile."
    prompt = f"Generate an executive, professional resume with sections: Executive Summary, Experience, Education, Projects, and Skills. Input profile: {json.dumps(profile_data)}"
    
    response = generate_ollama_response(prompt, system_prompt=system_prompt)
    if response:
        return response
        
    # Fallback Resume
    return f"""
    # {profile_data.get('name', 'STUDENT NAME')}
    **Email**: {profile_data.get('email', 'student@college.edu')} | **PRN/ID**: {profile_data.get('prn', 'PAT-0000')}
    
    ## 🎯 EXECUTIVE SUMMARY
    Dedicated student seeking a professional opportunity in the field of engineering and technology. Driven to solve complex problems and apply class learning into practical software applications.
    
    ## 🛠️ TECHNICAL SKILLS
    - **Languages**: {profile_data.get('skills', 'Python, Java, HTML, CSS, JavaScript')}
    - **Tools & Frameworks**: Git, Django, PostgreSQL, Bootstrap
    
    ## 🎓 EDUCATION
    - **Course**: {profile_data.get('course', 'Computer Science')}
    - **Institution**: Sir Sitaram and Lady Shantabai Patkar College
    
    ## 🚀 PROJECTS
    - **College ERP Enhancement**: Built multi-channel notification dispatches, QR desks, and embedded calling channels.
    """

def ai_check_assignment(submission_text, assignment_desc):
    """
    Grades a student assignment submission.
    Returns suggested marks and detailed grading feedback.
    """
    system_prompt = "You are a grading assistant. Output a JSON object containing score (out of 100) and feedback text. Format: { \"score\": 85, \"feedback\": \"Detailed feedback here...\" }."
    prompt = f"Assignment Description: {assignment_desc}\n\nStudent Submission: {submission_text}"
    
    response = generate_ollama_response(prompt, system_prompt=system_prompt, response_format="json")
    try:
        if response:
            return json.loads(response)
    except Exception:
        pass
        
    # Fallback Checker
    score = 80
    feedback = "Good submission. The text addresses the main points of the assignment prompt. To improve, add deeper analytical context and structural formatting."
    return {"score": score, "feedback": feedback}
