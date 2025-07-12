# AWS Professional Architect Exam Preparation Agent - Deployment Guide

## Overview
This guide provides comprehensive instructions for deploying the AWS Professional Architect exam preparation agent in various environments.

## Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- npm or yarn
- Docker (optional, for containerized deployment)
- Git

## Local Development Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd aws-exam-prep-agent
```

### 2. Quick Start (Recommended)
```bash
chmod +x start.sh
./start.sh
```

### 3. Manual Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed database with sample data
python seed_data.py

# Start the backend server
python app.py
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

## Docker Deployment

### 1. Using Docker Compose (Recommended)
```bash
docker-compose up --build
```

### 2. Manual Docker Setup
```bash
# Build backend image
docker build -t aws-exam-prep-backend ./backend

# Build frontend image
docker build -t aws-exam-prep-frontend ./frontend

# Run backend container
docker run -d -p 8000:8000 --name backend aws-exam-prep-backend

# Run frontend container
docker run -d -p 3000:3000 --name frontend aws-exam-prep-frontend
```

## Production Deployment

### 1. AWS ECS Deployment
```bash
# Create ECS task definition
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json

# Create ECS service
aws ecs create-service --cluster my-cluster --service-name aws-exam-prep --task-definition aws-exam-prep:1
```

### 2. AWS Lambda + S3 Deployment
```bash
# Build frontend for production
cd frontend
npm run build

# Deploy to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Deploy backend to Lambda
cd ../backend
zip -r lambda-deployment.zip . -x "__pycache__/*" "*.pyc" "venv/*"
aws lambda update-function-code --function-name aws-exam-prep-api --zip-file fileb://lambda-deployment.zip
```

### 3. Traditional Server Deployment
```bash
# Install system dependencies
sudo apt update
sudo apt install python3-pip nodejs npm nginx

# Set up application
git clone <repository-url>
cd aws-exam-prep-agent

# Backend setup
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed_data.py

# Frontend setup
cd ../frontend
npm install
npm run build

# Configure nginx
sudo cp nginx.conf /etc/nginx/sites-available/aws-exam-prep
sudo ln -s /etc/nginx/sites-available/aws-exam-prep /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Set up process management
sudo cp systemd/aws-exam-prep-backend.service /etc/systemd/system/
sudo systemctl enable aws-exam-prep-backend
sudo systemctl start aws-exam-prep-backend
```

## Environment Variables

### Backend
- `DATABASE_URL`: Database connection string (default: sqlite:///./aws_exam_prep.db)
- `PORT`: Backend server port (default: 8000)
- `HOST`: Backend server host (default: 0.0.0.0)

### Frontend
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)

## Database Configuration

### SQLite (Default)
The application uses SQLite by default, which is perfect for development and small-scale deployments.

### PostgreSQL (Production)
For production deployments, configure PostgreSQL:

```bash
# Install PostgreSQL dependencies
pip install psycopg2-binary

# Set environment variable
export DATABASE_URL="postgresql://username:password@localhost/aws_exam_prep"

# Run migrations
python seed_data.py
```

## Monitoring and Logging

### Application Monitoring
- Use AWS CloudWatch for AWS deployments
- Set up health check endpoints at `/health`
- Monitor API response times and error rates

### Logging Configuration
```python
# Add to backend/app.py
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

## Security Considerations

### API Security
- Enable CORS properly for production
- Implement rate limiting
- Use HTTPS in production
- Consider API authentication if needed

### Database Security
- Use strong passwords for database connections
- Enable SSL for database connections
- Regular backups
- Input validation and sanitization

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :8000
   # Kill process
   kill -9 <PID>
   ```

2. **Database Connection Issues**
   ```bash
   # Check database file permissions
   ls -la aws_exam_prep.db
   # Recreate database
   rm aws_exam_prep.db
   python seed_data.py
   ```

3. **Frontend Build Issues**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## Performance Optimization

### Backend Optimization
- Use connection pooling for database
- Implement caching for frequently accessed data
- Use async endpoints where appropriate

### Frontend Optimization
- Implement lazy loading for components
- Use React.memo for expensive components
- Optimize bundle size with code splitting

## Backup and Recovery

### Database Backup
```bash
# SQLite backup
cp aws_exam_prep.db aws_exam_prep_backup_$(date +%Y%m%d).db

# PostgreSQL backup
pg_dump aws_exam_prep > aws_exam_prep_backup_$(date +%Y%m%d).sql
```

### Application Backup
```bash
# Create full application backup
tar -czf aws_exam_prep_backup_$(date +%Y%m%d).tar.gz .
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancers for multiple backend instances
- Implement session storage (Redis/database)
- Use CDN for static assets

### Vertical Scaling
- Monitor resource usage
- Optimize database queries
- Use caching strategies

## Support and Maintenance

### Regular Maintenance Tasks
1. Update dependencies monthly
2. Monitor application logs
3. Backup database weekly
4. Test disaster recovery procedures
5. Update question bank regularly

### Health Checks
- Backend: `curl http://localhost:8000/health`
- Frontend: Check if React app loads properly
- Database: Verify question counts and data integrity

## License
MIT License - See LICENSE file for details