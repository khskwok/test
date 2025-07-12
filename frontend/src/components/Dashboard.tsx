import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon, 
  QuestionMarkCircleIcon, 
  AcademicCapIcon, 
  ChartBarIcon,
  TrophyIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { apiService } from '../services/apiService';

interface DashboardStats {
  totalQuestions: number;
  answeredQuestions: number;
  accuracy: number;
  domainStats: Array<{
    domain: string;
    accuracy: number;
    answered: number;
    totalQuestions: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.getProgress();
        setStats(response);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      name: 'Practice Questions',
      description: 'Test your knowledge with practice questions',
      icon: QuestionMarkCircleIcon,
      href: '/questions',
      color: 'bg-blue-500',
    },
    {
      name: 'Study Guides',
      description: 'Review AWS services and concepts',
      icon: BookOpenIcon,
      href: '/study-guides',
      color: 'bg-green-500',
    },
    {
      name: 'Flashcards',
      description: 'Quick review with flashcards',
      icon: AcademicCapIcon,
      href: '/flashcards',
      color: 'bg-purple-500',
    },
    {
      name: 'Exam Simulator',
      description: 'Take a full practice exam',
      icon: ClockIcon,
      href: '/exam-simulator',
      color: 'bg-red-500',
    },
  ];

  const domains = [
    'Design Resilient Architectures',
    'Design High-Performing Architectures',
    'Design Secure Applications and Architectures',
    'Design Cost-Optimized Architectures',
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600">Ready to continue your AWS certification journey?</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-aws-orange">{stats?.accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-aws-blue">{stats?.answeredQuestions}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats?.accuracy.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <QuestionMarkCircleIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats?.answeredQuestions}</div>
              <div className="text-sm text-gray-600">Questions Answered</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">{stats?.totalQuestions}</div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.domainStats.length || 0}
              </div>
              <div className="text-sm text-gray-600">Domains Studied</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              to={action.href}
              className="group block bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-lg p-2 ${action.color}`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900 group-hover:text-aws-orange">
                    {action.name}
                  </div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Domain Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Domain Progress</h2>
        <div className="space-y-4">
          {domains.map((domain) => {
            const domainStat = stats?.domainStats.find(s => s.domain === domain);
            const progress = domainStat ? (domainStat.answered / domainStat.totalQuestions) * 100 : 0;
            const accuracy = domainStat?.accuracy || 0;
            
            return (
              <div key={domain} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{domain}</h3>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">
                      {domainStat?.answered || 0}/{domainStat?.totalQuestions || 0} questions
                    </span>
                    <span className="text-sm font-medium text-aws-orange">
                      {accuracy.toFixed(1)}% accuracy
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-aws-orange h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;