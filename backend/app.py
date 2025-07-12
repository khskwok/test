from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import os

from database import get_db, engine, Base
from models import Question, StudyGuide, UserProgress, Flashcard, Answer
from schemas import (
    QuestionResponse, StudyGuideResponse, UserProgressResponse,
    FlashcardResponse, AnswerRequest, AnswerResponse, QuestionRequest
)

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AWS Professional Architect Exam Prep API",
    description="A comprehensive API for AWS certification exam preparation",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AWS Professional Architect Exam Prep API"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# Questions endpoints
@app.get("/api/questions", response_model=List[QuestionResponse])
def get_questions(
    domain: Optional[str] = None,
    difficulty: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Get practice questions with optional filtering"""
    query = db.query(Question)
    
    if domain:
        query = query.filter(Question.domain == domain)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    
    questions = query.offset(offset).limit(limit).all()
    return questions

@app.get("/api/questions/{question_id}", response_model=QuestionResponse)
def get_question(question_id: int, db: Session = Depends(get_db)):
    """Get a specific question by ID"""
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@app.post("/api/answers", response_model=AnswerResponse)
def submit_answer(answer: AnswerRequest, db: Session = Depends(get_db)):
    """Submit an answer and get feedback"""
    question = db.query(Question).filter(Question.id == answer.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = answer.selected_answer == question.correct_answer
    
    # Record the answer
    user_answer = Answer(
        question_id=answer.question_id,
        selected_answer=answer.selected_answer,
        is_correct=is_correct,
        time_taken=answer.time_taken
    )
    db.add(user_answer)
    db.commit()
    
    return AnswerResponse(
        is_correct=is_correct,
        correct_answer=question.correct_answer,
        explanation=question.explanation,
        domain=question.domain
    )

# Study guides endpoints
@app.get("/api/study-guides", response_model=List[StudyGuideResponse])
def get_study_guides(
    domain: Optional[str] = None,
    service: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get study guides with optional filtering"""
    query = db.query(StudyGuide)
    
    if domain:
        query = query.filter(StudyGuide.domain == domain)
    if service:
        query = query.filter(StudyGuide.service == service)
    
    guides = query.all()
    return guides

@app.get("/api/study-guides/{guide_id}", response_model=StudyGuideResponse)
def get_study_guide(guide_id: int, db: Session = Depends(get_db)):
    """Get a specific study guide by ID"""
    guide = db.query(StudyGuide).filter(StudyGuide.id == guide_id).first()
    if not guide:
        raise HTTPException(status_code=404, detail="Study guide not found")
    return guide

# Flashcards endpoints
@app.get("/api/flashcards", response_model=List[FlashcardResponse])
def get_flashcards(
    domain: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get flashcards with optional filtering"""
    query = db.query(Flashcard)
    
    if domain:
        query = query.filter(Flashcard.domain == domain)
    
    flashcards = query.all()
    return flashcards

# Progress endpoints
@app.get("/api/progress", response_model=UserProgressResponse)
def get_progress(db: Session = Depends(get_db)):
    """Get user progress statistics"""
    total_questions = db.query(Question).count()
    total_answered = db.query(Answer).count()
    correct_answers = db.query(Answer).filter(Answer.is_correct == True).count()
    
    accuracy = (correct_answers / total_answered * 100) if total_answered > 0 else 0
    
    # Domain-specific progress
    domain_stats = []
    domains = ["Design Resilient Architectures", "Design High-Performing Architectures", 
               "Design Secure Applications and Architectures", "Design Cost-Optimized Architectures"]
    
    for domain in domains:
        domain_questions = db.query(Question).filter(Question.domain == domain).count()
        domain_answers = db.query(Answer).join(Question).filter(Question.domain == domain).count()
        domain_correct = db.query(Answer).join(Question).filter(
            Question.domain == domain, Answer.is_correct == True
        ).count()
        
        domain_accuracy = (domain_correct / domain_answers * 100) if domain_answers > 0 else 0
        
        domain_stats.append({
            "domain": domain,
            "total_questions": domain_questions,
            "answered": domain_answers,
            "accuracy": domain_accuracy
        })
    
    return UserProgressResponse(
        total_questions=total_questions,
        answered_questions=total_answered,
        correct_answers=correct_answers,
        accuracy=accuracy,
        domain_stats=domain_stats
    )

# Exam simulation endpoint
@app.get("/api/exam/simulate")
def simulate_exam(db: Session = Depends(get_db)):
    """Generate a full exam simulation with questions from all domains"""
    # AWS Professional Architect exam has 75 questions
    questions_per_domain = {
        "Design Resilient Architectures": 20,
        "Design High-Performing Architectures": 18,
        "Design Secure Applications and Architectures": 23,
        "Design Cost-Optimized Architectures": 14
    }
    
    exam_questions = []
    for domain, count in questions_per_domain.items():
        domain_questions = db.query(Question).filter(Question.domain == domain).limit(count).all()
        exam_questions.extend(domain_questions)
    
    return {
        "exam_id": f"exam_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "questions": exam_questions,
        "time_limit": 180,  # 3 hours in minutes
        "total_questions": len(exam_questions)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)