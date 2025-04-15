import React, { useState } from 'react';
import axios from 'axios';

interface ScoreResult {
  score: number;
  label: string;
  confidence: number;
}

const App: React.FC = () => {
  const [companyData, setCompanyData] = useState({
    name: '',
    industry: '',
    teamSize: ''
  });
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Client-side validation
      if (!companyData.name || !companyData.industry || !companyData.teamSize) {
        throw new Error('Please fill all fields');
      }

      const teamSize = parseInt(companyData.teamSize);
      if (isNaN(teamSize) || teamSize <= 0) {
        throw new Error('Team size must be a positive number');
      }

      const payload = {
        name: companyData.name,
        industry: companyData.industry,
        team_size: teamSize
      };

      const response = await axios.post('http://localhost:8000/api/v1/score', payload);
      setResult(response.data);
    } catch (err: unknown) {
      let errorMessage = 'Failed to calculate score';
      
      if (axios.isAxiosError(err)) {
        // Handle API errors
        errorMessage = err.response?.data?.detail || err.message || errorMessage;
        
        if (err.response?.status === 400) {
          errorMessage = "Invalid data: " + (err.response.data.detail || "please check your inputs");
        }
        else if (err.response?.status === 500) {
          errorMessage = "Server error - please try again later";
        }
      } 
      else if (err instanceof Error) {
        // Handle client-side errors
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-800';
    if (score >= 40) return 'bg-amber-100 text-amber-800';
    return 'bg-rose-100 text-rose-800';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-emerald-600';
    if (confidence >= 0.6) return 'text-amber-600';
    return 'text-rose-600';
  };

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Education',
    'Other'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-white">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold">Company Maturity Score</h1>
                <p className="text-blue-100">Evaluate your company's growth stage</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Enter company name"
                  value={companyData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <select
                  id="industry"
                  name="industry"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjEwMTAxMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_1rem_center] bg-[length:1.5rem]"
                  value={companyData.industry}
                  onChange={handleInputChange}
                >
                  <option value="">Select industry</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-1">
                  Team Size *
                </label>
                <input
                  type="number"
                  id="teamSize"
                  name="teamSize"
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Number of employees"
                  value={companyData.teamSize}
                  onChange={handleInputChange}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="animate-fade-in">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Calculation Error</h3>
                        <div className="mt-1 text-sm text-red-700">
                          <p>{error}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-xl font-medium text-white transition duration-200 ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </span>
                  ) : (
                    "Calculate Maturity Score"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Results */}
          {result && (
            <div className="border-t border-gray-200 px-6 py-8 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Evaluation Results</h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Maturity Score</h3>
                    <p className={`text-4xl font-bold mt-1 ${getScoreColor(result.score)} px-4 py-2 rounded-full inline-block`}>
                      {result.score}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-sm font-medium text-gray-500">Stage</h3>
                    <p className="text-2xl font-semibold text-gray-800 mt-1">{result.label}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Confidence Level</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  <p className={`text-right mt-1 text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                    {(result.confidence * 100).toFixed(0)}%
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Recommendations</h3>
                  <div className="space-y-2">
                    {result.score < 40 && (
                      <p className="text-sm text-gray-700">Your company is in the early stages. Focus on product-market fit and building your core team.</p>
                    )}
                    {result.score >= 40 && result.score < 80 && (
                      <p className="text-sm text-gray-700">Your company is established. Consider scaling operations and expanding your market reach.</p>
                    )}
                    {result.score >= 80 && (
                      <p className="text-sm text-gray-700">Your company is mature. Explore innovation and potential diversification strategies.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;