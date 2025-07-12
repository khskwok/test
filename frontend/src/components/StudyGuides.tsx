import React, { useState, useEffect } from 'react';
import { BookOpenIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { apiService, StudyGuide } from '../services/apiService';

const StudyGuides: React.FC = () => {
  const [guides, setGuides] = useState<StudyGuide[]>([]);
  const [selectedGuide, setSelectedGuide] = useState<StudyGuide | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    domain: '',
    service: '',
  });

  const domains = [
    'Design Resilient Architectures',
    'Design High-Performing Architectures',
    'Design Secure Applications and Architectures',
    'Design Cost-Optimized Architectures',
  ];

  const services = ['EC2', 'RDS', 'Lambda', 'S3', 'VPC', 'IAM', 'CloudFormation'];

  useEffect(() => {
    fetchGuides();
  }, [filters]);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const response = await apiService.getStudyGuides({
        domain: filters.domain || undefined,
        service: filters.service || undefined,
      });
      setGuides(response);
    } catch (error) {
      console.error('Error fetching study guides:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseJsonString = (jsonString: string | null): string[] => {
    if (!jsonString) return [];
    try {
      return JSON.parse(jsonString);
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aws-orange"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Study Guides</h1>
            <p className="text-gray-600">Comprehensive guides for AWS services and concepts</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-aws-orange">{guides.length}</div>
            <div className="text-sm text-gray-600">Available Guides</div>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
            <select
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-aws-orange"
            >
              <option value="">All Services</option>
              {services.map((service) => (
                <option key={service} value={service}>{service}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Study Guides List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Study Guides</h2>
            <div className="space-y-3">
              {guides.map((guide) => (
                <button
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedGuide?.id === guide.id
                      ? 'border-aws-orange bg-orange-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpenIcon className="h-5 w-5 text-aws-orange mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{guide.title}</div>
                        <div className="text-sm text-gray-500">{guide.service}</div>
                      </div>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Study Guide Detail */}
        <div className="bg-white rounded-lg shadow">
          {selectedGuide ? (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedGuide.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedGuide.service}
                  </span>
                  <span>{selectedGuide.domain}</span>
                </div>
              </div>

              <div className="space-y-6">
                {/* Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedGuide.content}</p>
                </div>

                {/* Key Points */}
                {selectedGuide.key_points && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Points</h3>
                    <ul className="space-y-2">
                      {parseJsonString(selectedGuide.key_points).map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-aws-orange rounded-full mt-2 mr-3"></span>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Use Cases */}
                {selectedGuide.use_cases && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Use Cases</h3>
                    <ul className="space-y-2">
                      {parseJsonString(selectedGuide.use_cases).map((useCase, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-gray-700">{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Best Practices */}
                {selectedGuide.best_practices && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Best Practices</h3>
                    <ul className="space-y-2">
                      {parseJsonString(selectedGuide.best_practices).map((practice, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3"></span>
                          <span className="text-gray-700">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Pricing Notes */}
                {selectedGuide.pricing_notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Pricing</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-gray-700">{selectedGuide.pricing_notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <BookOpenIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Select a study guide to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyGuides;