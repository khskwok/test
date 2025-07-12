from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Question schemas
class QuestionBase(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str = Field(..., regex="^[ABCD]$")
    explanation: str
    domain: str
    difficulty: str
    aws_service: Optional[str] = None
    tags: Optional[str] = None

class QuestionRequest(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Study Guide schemas
class StudyGuideBase(BaseModel):
    title: str
    content: str
    domain: str
    service: str
    key_points: Optional[str] = None
    use_cases: Optional[str] = None
    best_practices: Optional[str] = None
    pricing_notes: Optional[str] = None

class StudyGuideRequest(StudyGuideBase):
    pass

class StudyGuideResponse(StudyGuideBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# Flashcard schemas
class FlashcardBase(BaseModel):
    front: str
    back: str
    domain: str
    service: Optional[str] = None
    difficulty: str
    tags: Optional[str] = None

class FlashcardRequest(FlashcardBase):
    pass

class FlashcardResponse(FlashcardBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Answer schemas
class AnswerRequest(BaseModel):
    question_id: int
    selected_answer: str = Field(..., regex="^[ABCD]$")
    time_taken: Optional[int] = None

class AnswerResponse(BaseModel):
    is_correct: bool
    correct_answer: str
    explanation: str
    domain: str

# Progress schemas
class DomainStats(BaseModel):
    domain: str
    total_questions: int
    answered: int
    accuracy: float

class UserProgressResponse(BaseModel):
    total_questions: int
    answered_questions: int
    correct_answers: int
    accuracy: float
    domain_stats: List[DomainStats]

# Exam session schemas
class ExamSessionBase(BaseModel):
    session_id: str
    total_questions: int

class ExamSessionRequest(ExamSessionBase):
    pass

class ExamSessionResponse(ExamSessionBase):
    id: int
    start_time: datetime
    end_time: Optional[datetime] = None
    answered_questions: int
    correct_answers: int
    score: Optional[float] = None
    time_taken: Optional[int] = None
    is_completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardStats(BaseModel):
    total_questions: int
    answered_questions: int
    accuracy: float
    study_time: int  # in minutes
    weak_domains: List[str]
    strong_domains: List[str]
    recent_activity: List[Dict[str, Any]]

# Service-specific schemas
class ServiceGuide(BaseModel):
    service: str
    description: str
    key_features: List[str]
    use_cases: List[str]
    pricing_model: str
    integration_points: List[str]

class ArchitecturePattern(BaseModel):
    name: str
    description: str
    components: List[str]
    use_cases: List[str]
    pros: List[str]
    cons: List[str]
    example_diagram: Optional[str] = None

# Comprehensive study plan schema
class StudyPlanResponse(BaseModel):
    week_number: int
    focus_domain: str
    recommended_questions: int
    study_guides: List[str]
    flashcard_sets: List[str]
    practice_exam: bool
    estimated_hours: int