import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpenIcon, 
  QuestionMarkCircleIcon, 
  AcademicCapIcon, 
  ChartBarIcon, 
  CogIcon,
  HomeIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Practice Questions', href: '/questions', icon: QuestionMarkCircleIcon },
    { name: 'Study Guides', href: '/study-guides', icon: BookOpenIcon },
    { name: 'Flashcards', href: '/flashcards', icon: AcademicCapIcon },
    { name: 'Exam Simulator', href: '/exam-simulator', icon: ClockIcon },
    { name: 'Progress', href: '/progress', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-aws-blue shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-white">
                  AWS Professional Architect
                </h1>
                <p className="text-aws-orange text-sm">Exam Preparation</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <span className="font-medium">Study Mode</span>
              </div>
              <button className="p-2 rounded-full text-gray-300 hover:text-white">
                <CogIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="py-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? 'bg-aws-orange text-white border-r-4 border-aws-orange'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-aws-orange'
                      }`}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;