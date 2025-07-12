import React, { useState, useEffect } from 'react';
import { ChartBarIcon, TrophyIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { apiService, UserProgress } from '../services/apiService';

const Progress: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProgress();
      setProgress(response);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLevel = (accuracy: number) => {
    if (accuracy >= 90) return { label: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (accuracy >= 80) return { label: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (accuracy >= 70) return { label: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getCompletionPercentage = (answered: number, total: number) => {
    return total > 0 ? (answered / total) * 100 : 0;
  };

  const getWeakAreas = () => {
    if (!progress) return [];
    return progress.domainStats
      .filter(stat => stat.accuracy < 70)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 3);
  };

  const getStrongAreas = () => {
    if (!progress) return [];
    return progress.domainStats
      .filter(stat => stat.accuracy >= 80)
      .sort((a, b) => b.accuracy - a.accuracy)
      .slice(0, 3);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange"></div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No progress data available</h2>
        <p className="text-gray-600">Start practicing to see your progress here.</p>
      </div>
    );
  }

  const performanceLevel = getPerformanceLevel(progress.accuracy);
  const overallCompletion = getCompletionPercentage(progress.answeredQuestions, progress.totalQuestions);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Dashboard</h1>
            <p className="text-gray-600">Track your AWS certification preparation journey</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aws-orange"
            >
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{progress.accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${performanceLevel.bg} ${performanceLevel.color} mt-1`}>
                {performanceLevel.label}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{progress.answeredQuestions}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
              <div className="text-xs text-gray-500 mt-1">
                {overallCompletion.toFixed(1)}% of total questions
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{progress.correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct Answers</div>
              <div className="text-xs text-gray-500 mt-1">
                {progress.answeredQuestions > 0 ? ((progress.correctAnswers / progress.answeredQuestions) * 100).toFixed(1) : 0}% success rate
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{progress.domainStats.length}</div>
              <div className="text-sm text-gray-600">Domains Studied</div>
              <div className="text-xs text-gray-500 mt-1">
                Out of 4 total domains
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Domain Progress</h2>
        <div className="space-y-6">
          {progress.domainStats.map((domain) => {
            const completionRate = getCompletionPercentage(domain.answered, domain.totalQuestions);
            const accuracyLevel = getPerformanceLevel(domain.accuracy);
            
            return (
              <div key={domain.domain} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-gray-900">{domain.domain}</h3>
                    <p className="text-sm text-gray-600">
                      {domain.answered} of {domain.totalQuestions} questions answered
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-aws-orange">{domain.accuracy.toFixed(1)}%</div>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${accuracyLevel.bg} ${accuracyLevel.color}`}>
                      {accuracyLevel.label}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Completion</span>
                    <span>{completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Accuracy</span>
                    <span>{domain.accuracy.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-aws-orange h-2 rounded-full transition-all duration-300"
                      style={{ width: `${domain.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Areas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Areas for Improvement</h2>
          {getWeakAreas().length > 0 ? (
            <div className="space-y-3">
              {getWeakAreas().map((area, index) => (
                <div key={area.domain} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{area.domain}</div>
                    <div className="text-sm text-gray-600">{area.accuracy.toFixed(1)}% accuracy</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-red-600 font-medium">Priority {index + 1}</div>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-800">
                  <strong>Recommendation:</strong> Focus on practicing questions in these domains to improve your overall score.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <TrophyIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Great job! No weak areas identified.</p>
            </div>
          )}
        </div>

        {/* Strong Areas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Strong Areas</h2>
          {getStrongAreas().length > 0 ? (
            <div className="space-y-3">
              {getStrongAreas().map((area, index) => (
                <div key={area.domain} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{area.domain}</div>
                    <div className="text-sm text-gray-600">{area.accuracy.toFixed(1)}% accuracy</div>
                  </div>
                  <div className="text-right">
                    <TrophyIcon className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              ))}
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-800">
                  <strong>Well done!</strong> You're performing excellently in these areas. Consider helping others or reviewing advanced topics.
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ChartBarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>Keep practicing to identify your strengths!</p>
            </div>
          )}
        </div>
      </div>

      {/* Study Plan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended Study Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 font-semibold">1</span>
              </div>
              <h3 className="font-medium text-gray-900">Focus on Weak Areas</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Spend 60% of your time on domains where you scored below 70%
            </p>
            <div className="text-xs text-gray-500">
              Recommended: 2-3 hours daily
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <h3 className="font-medium text-gray-900">Review Strong Areas</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Maintain your performance in areas where you excel
            </p>
            <div className="text-xs text-gray-500">
              Recommended: 30 minutes daily
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-green-600 font-semibold">3</span>
              </div>
              <h3 className="font-medium text-gray-900">Practice Exams</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Take full practice exams weekly to assess overall progress
            </p>
            <div className="text-xs text-gray-500">
              Recommended: 1-2 exams per week
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;