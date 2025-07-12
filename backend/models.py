from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    question_text = Column(Text, nullable=False)
    option_a = Column(Text, nullable=False)
    option_b = Column(Text, nullable=False)
    option_c = Column(Text, nullable=False)
    option_d = Column(Text, nullable=False)
    correct_answer = Column(String(1), nullable=False)  # A, B, C, or D
    explanation = Column(Text, nullable=False)
    domain = Column(String(100), nullable=False)  # Exam domain
    difficulty = Column(String(20), nullable=False)  # Easy, Medium, Hard
    aws_service = Column(String(50), nullable=True)  # Primary AWS service
    tags = Column(Text, nullable=True)  # JSON string of tags
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    answers = relationship("Answer", back_populates="question")

class StudyGuide(Base):
    __tablename__ = "study_guides"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    domain = Column(String(100), nullable=False)
    service = Column(String(50), nullable=False)
    key_points = Column(Text, nullable=True)  # JSON string of key points
    use_cases = Column(Text, nullable=True)  # JSON string of use cases
    best_practices = Column(Text, nullable=True)  # JSON string of best practices
    pricing_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Flashcard(Base):
    __tablename__ = "flashcards"
    
    id = Column(Integer, primary_key=True, index=True)
    front = Column(Text, nullable=False)  # Question or term
    back = Column(Text, nullable=False)  # Answer or definition
    domain = Column(String(100), nullable=False)
    service = Column(String(50), nullable=True)
    difficulty = Column(String(20), nullable=False)
    tags = Column(Text, nullable=True)  # JSON string of tags
    created_at = Column(DateTime, server_default=func.now())

class Answer(Base):
    __tablename__ = "answers"
    
    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_answer = Column(String(1), nullable=False)  # A, B, C, or D
    is_correct = Column(Boolean, nullable=False)
    time_taken = Column(Integer, nullable=True)  # Time in seconds
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    question = relationship("Question", back_populates="answers")

class UserProgress(Base):
    __tablename__ = "user_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(100), nullable=False)
    total_questions = Column(Integer, default=0)
    answered_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    time_spent = Column(Integer, default=0)  # Time in minutes
    last_studied = Column(DateTime, server_default=func.now())
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ExamSession(Base):
    __tablename__ = "exam_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(50), unique=True, nullable=False)
    start_time = Column(DateTime, server_default=func.now())
    end_time = Column(DateTime, nullable=True)
    total_questions = Column(Integer, nullable=False)
    answered_questions = Column(Integer, default=0)
    correct_answers = Column(Integer, default=0)
    score = Column(Float, nullable=True)
    time_taken = Column(Integer, nullable=True)  # Time in minutes
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())