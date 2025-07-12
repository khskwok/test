# AWS Professional Architect Exam Preparation Agent

A comprehensive learning platform designed to help you prepare for the AWS Certified Solutions Architect - Professional exam.

## Features

- **Practice Questions**: Comprehensive question bank covering all exam domains
- **Study Guides**: Detailed explanations for each AWS service and architecture pattern
- **Progress Tracking**: Monitor your learning progress and identify weak areas
- **Interactive Flashcards**: Quick review of key concepts and services
- **Exam Simulation**: Full-length practice exams with detailed explanations
- **Architecture Diagrams**: Visual learning aids for complex AWS architectures
- **Performance Analytics**: Detailed insights into your preparation progress

## Exam Domains Covered

1. **Design Resilient Architectures** (26% of exam)
2. **Design High-Performing Architectures** (24% of exam)
3. **Design Secure Applications and Architectures** (30% of exam)
4. **Design Cost-Optimized Architectures** (20% of exam)

## Quick Start

### Option 1: One-Command Setup (Recommended)
```bash
./start.sh
```

This script will:
- Check for required dependencies (Python 3, Node.js)
- Set up Python virtual environment
- Install all backend dependencies
- Seed the database with sample questions
- Install all frontend dependencies
- Start both backend and frontend servers

### Option 2: Manual Setup

#### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python seed_data.py  # Seed database with sample data
python app.py
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Option 3: Docker Setup
```bash
docker-compose up --build
```

### Database Setup
The SQLite database will be automatically created on first run with sample AWS Professional Architect questions, study guides, and flashcards.

## Tech Stack

- **Backend**: Python, FastAPI, SQLAlchemy, SQLite
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: SQLite (development), PostgreSQL (production)
- **Deployment**: Docker, AWS ECS (optional)

## API Endpoints

- `GET /api/questions` - Get practice questions
- `GET /api/study-guides` - Get study materials
- `POST /api/answers` - Submit answers and get feedback
- `GET /api/progress` - Get user progress statistics
- `GET /api/flashcards` - Get flashcard sets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your improvements
4. Submit a pull request

## License

MIT License - see LICENSE file for details