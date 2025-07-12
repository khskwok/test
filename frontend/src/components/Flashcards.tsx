import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { apiService, Flashcard } from '../services/apiService';

const Flashcards: React.FC = () => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    domain: '',
    difficulty: '',
  });

  const domains = [
    'Design Resilient Architectures',
    'Design High-Performing Architectures',
    'Design Secure Applications and Architectures',
    'Design Cost-Optimized Architectures',
  ];

  const difficulties = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchFlashcards();
  }, [filters]);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await apiService.getFlashcards({
        domain: filters.domain || undefined,
      });
      setFlashcards(response);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentCard = flashcards[currentIndex];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange"></div>
      </div>
    );
  }

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">No flashcards found</h2>
        <p className="text-gray-600">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Flashcards</h1>
            <p className="text-gray-600">
              Card {currentIndex + 1} of {flashcards.length}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleShuffle}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Shuffle
            </button>
            <div className="text-right">
              <div className="text-sm text-gray-600">Domain</div>
              <div className="font-medium text-aws-orange">{currentCard?.domain}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
            <select
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aws-orange"
            >
              <option value="">All Domains</option>
              {domains.map((domain) => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aws-orange"
            >
              <option value="">All Difficulties</option>
              {difficulties.map((difficulty) => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {currentCard?.difficulty}
          </span>
          <span className="text-sm text-gray-500">
            {currentCard?.service}
          </span>
        </div>

        {/* Card Container */}
        <div className="relative mx-auto max-w-2xl">
          <div
            className={`relative w-full h-96 cursor-pointer transition-transform duration-700 transform-style-preserve-3d ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={handleFlip}
          >
            {/* Front of card */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="h-full bg-gradient-to-br from-aws-blue to-aws-light-blue rounded-lg shadow-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-white text-xl font-medium mb-4">
                    {currentCard?.front}
                  </div>
                  <div className="text-gray-200 text-sm">
                    Click to reveal answer
                  </div>
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
              <div className="h-full bg-gradient-to-br from-aws-orange to-yellow-500 rounded-lg shadow-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-white text-lg leading-relaxed">
                    {currentCard?.back}
                  </div>
                  <div className="text-gray-100 text-sm mt-4">
                    Click to go back to question
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Previous
          </button>

          <div className="flex items-center space-x-2">
            {flashcards.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsFlipped(false);
                }}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-aws-orange' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentIndex === flashcards.length - 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRightIcon className="h-4 w-4 ml-1" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
          <span className="text-sm text-gray-600">
            {Math.round(((currentIndex + 1) / flashcards.length) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-aws-orange h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / flashcards.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Flashcards;