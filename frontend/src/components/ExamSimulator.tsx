import React, { useState, useEffect } from 'react';
import { ClockIcon, CheckCircleIcon, XCircleIcon, PlayIcon } from '@heroicons/react/24/outline';
import { apiService, Question, AnswerRequest } from '../services/apiService';

interface ExamState {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<number, string>;
  timeRemaining: number;
  isActive: boolean;
  isCompleted: boolean;
  score: number;
  startTime: number;
}

const ExamSimulator: React.FC = () => {
  const [exam, setExam] = useState<ExamState>({
    questions: [],
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 180 * 60, // 3 hours in seconds
    isActive: false,
    isCompleted: false,
    score: 0,
    startTime: 0,
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (exam.isActive && exam.timeRemaining > 0) {
      interval = setInterval(() => {
        setExam(prev => {
          if (prev.timeRemaining <= 1) {
            handleCompleteExam();
            return { ...prev, timeRemaining: 0, isActive: false };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [exam.isActive, exam.timeRemaining]);

  const startExam = async () => {
    try {
      setLoading(true);
      const response = await apiService.simulateExam();
      setExam({
        questions: response.questions,
        currentQuestionIndex: 0,
        answers: {},
        timeRemaining: response.time_limit * 60,
        isActive: true,
        isCompleted: false,
        score: 0,
        startTime: Date.now(),
      });
    } catch (error) {
      console.error('Error starting exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setExam(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer },
    }));
  };

  const handleNextQuestion = () => {
    if (exam.currentQuestionIndex < exam.questions.length - 1) {
      setExam(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1,
      }));
    }
  };

  const handlePreviousQuestion = () => {
    if (exam.currentQuestionIndex > 0) {
      setExam(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1,
      }));
    }
  };

  const handleCompleteExam = async () => {
    const examResults = [];
    let correctAnswers = 0;

    for (const question of exam.questions) {
      const userAnswer = exam.answers[question.id];
      const isCorrect = userAnswer === question.correct_answer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      examResults.push({
        question,
        userAnswer,
        isCorrect,
      });
    }

    const score = (correctAnswers / exam.questions.length) * 100;
    
    setExam(prev => ({
      ...prev,
      isActive: false,
      isCompleted: true,
      score,
    }));
    
    setResults(examResults);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = exam.questions[exam.currentQuestionIndex];
  const answeredCount = Object.keys(exam.answers).length;
  const progressPercentage = (answeredCount / exam.questions.length) * 100;

  if (!exam.isActive && !exam.isCompleted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-aws-orange rounded-full flex items-center justify-center mb-6">
            <PlayIcon className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">AWS Professional Architect Exam Simulator</h1>
          <p className="text-gray-600 mb-8">
            Take a full-length practice exam with 75 questions covering all domains.
            You'll have 3 hours to complete the exam.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-aws-orange">75</div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-aws-orange">180</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-aws-orange">720</div>
              <div className="text-sm text-gray-600">Passing Score</div>
            </div>
          </div>

          <button
            onClick={startExam}
            disabled={loading}
            className="px-8 py-3 bg-aws-orange text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Start Exam'}
          </button>
        </div>
      </div>
    );
  }

  if (exam.isCompleted) {
    const passingScore = 72; // AWS passing score is typically 720/1000
    const passed = exam.score >= passingScore;
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className={`mx-auto w-16 h-16 ${passed ? 'bg-green-500' : 'bg-red-500'} rounded-full flex items-center justify-center mb-6`}>
            {passed ? (
              <CheckCircleIcon className="h-8 w-8 text-white" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-white" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {passed ? 'Congratulations!' : 'Keep Studying!'}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-aws-orange">{exam.score.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-aws-orange">{answeredCount}</div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-aws-orange">
                {results.filter(r => r.isCorrect).length}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
          </div>

          <div className="text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Domain Breakdown</h2>
            <div className="space-y-4">
              {['Design Resilient Architectures', 'Design High-Performing Architectures', 'Design Secure Applications and Architectures', 'Design Cost-Optimized Architectures'].map(domain => {
                const domainResults = results.filter(r => r.question.domain === domain);
                const domainScore = domainResults.length > 0 ? (domainResults.filter(r => r.isCorrect).length / domainResults.length) * 100 : 0;
                
                return (
                  <div key={domain} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{domain}</h3>
                      <span className="text-sm font-medium text-aws-orange">
                        {domainScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-aws-orange h-2 rounded-full transition-all duration-300"
                        style={{ width: `${domainScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-x-4">
            <button
              onClick={startExam}
              className="px-6 py-2 bg-aws-orange text-white rounded-md hover:bg-orange-600"
            >
              Retake Exam
            </button>
            <button
              onClick={() => window.location.href = '/questions'}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Practice Questions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam in Progress</h1>
            <p className="text-gray-600">
              Question {exam.currentQuestionIndex + 1} of {exam.questions.length}
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-aws-orange">
                {formatTime(exam.timeRemaining)}
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                Time Remaining
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-aws-blue">{answeredCount}</div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm text-gray-600">
            {answeredCount} of {exam.questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-aws-orange h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {currentQuestion?.difficulty}
            </span>
            <span className="text-sm text-gray-500">
              {currentQuestion?.aws_service}
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {currentQuestion?.question_text}
          </h3>
        </div>

        <div className="space-y-3 mb-6">
          {['A', 'B', 'C', 'D'].map((option) => {
            const optionText = currentQuestion?.[`option_${option.toLowerCase()}` as keyof Question] as string;
            const isSelected = exam.answers[currentQuestion?.id] === option;
            
            return (
              <button
                key={option}
                onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  isSelected
                    ? 'border-aws-orange bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                    {option}
                  </span>
                  <span className="text-gray-900">{optionText}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePreviousQuestion}
            disabled={exam.currentQuestionIndex === 0}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleCompleteExam}
            className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Submit Exam
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={exam.currentQuestionIndex === exam.questions.length - 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamSimulator;