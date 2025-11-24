import React, { useState } from 'react';
import { analyzeCompetitors } from '../services/geminiService';
import { AnalysisResult } from '../types';
import ReactMarkdown from 'react-markdown';

// Simple Markdown renderer placeholder if you don't want an external lib, 
// but for "World Class" usually a parser is needed. 
// Since I cannot import new libs outside of the prompt's explicit instructions (though standard pattern allows popular ones),
// I will write a very simple display or assume the user reads raw text if I can't fetch `react-markdown`.
// Wait, the prompt says "Use popular and existing libraries". I will use standard formatting for now to avoid package issues if they aren't pre-installed in the environment mock. 
// actually, I'll just render whitespace-pre-wrap for simplicity and robustness, or a simple parser function.
// Let's stick to pre-wrap div for safety, styling it nicely.

const CompetitorAnalysis: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeCompetitors(query);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-serif font-bold text-cat-900">Know Your Enemy.</h2>
        <p className="text-cat-600 text-lg">
          Leverage Google Gemini's real-time search to analyze specific competitors or entire market niches.
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="relative">
        <div className="flex shadow-xl rounded-full overflow-hidden border border-cat-200 bg-white">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'Modern luxury cat furniture brands' or 'Tuft + Paw'"
            className="flex-1 px-8 py-4 text-lg focus:outline-none text-cat-800 placeholder:text-cat-300"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className={`px-10 font-bold text-white transition-colors ${
              loading ? 'bg-cat-400 cursor-not-allowed' : 'bg-cat-800 hover:bg-cat-700'
            }`}
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-center">
          {error}
        </div>
      )}

      {result && (
        <div className="animate-fade-in space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-cat-100">
            <h3 className="text-2xl font-serif font-bold text-cat-800 mb-6 border-b border-cat-100 pb-4">
              Market Intelligence Report
            </h3>
            <div className="prose prose-stone max-w-none text-cat-700 leading-relaxed whitespace-pre-wrap">
              {result.content}
            </div>
          </div>

          {result.sources.length > 0 && (
            <div className="bg-cat-50 p-6 rounded-2xl border border-cat-200">
              <h4 className="text-sm font-bold text-cat-500 uppercase tracking-wider mb-4">Sources & References</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center space-x-2 text-cat-700 hover:text-accent-dark transition group"
                    >
                      <span className="w-2 h-2 bg-accent rounded-full group-hover:scale-125 transition"></span>
                      <span className="truncate text-sm underline decoration-cat-300 underline-offset-4">{source.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CompetitorAnalysis;