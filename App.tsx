import React, { useState } from 'react';
import { Tab } from './types';
import StorePreview from './components/StorePreview';
import CompetitorAnalysis from './components/CompetitorAnalysis';
import GuruChat from './components/GuruChat';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.STORE_PREVIEW);

  // Simple Icon Components
  const Icons = {
    Store: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    Chart: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    Chat: () => (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-cat-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-cat-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <span className="text-3xl mr-2">🐾</span>
              <span className="text-2xl font-serif font-bold text-cat-900 tracking-tight">Purrfect<span className="text-accent-dark">Ventures</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {[
                { id: Tab.STORE_PREVIEW, label: 'Mock Storefront', icon: Icons.Store },
                { id: Tab.COMPETITORS, label: 'Competitor Analysis', icon: Icons.Chart },
                { id: Tab.GURU_CHAT, label: 'Guru Chat', icon: Icons.Chat },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-cat-800 text-white shadow-lg transform scale-105'
                      : 'text-cat-600 hover:bg-cat-100 hover:text-cat-900'
                  }`}
                >
                  <tab.icon />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Strip */}
        <div className="md:hidden flex justify-around border-t border-cat-100 bg-white py-3">
             {[
                { id: Tab.STORE_PREVIEW, label: 'Store', icon: Icons.Store },
                { id: Tab.COMPETITORS, label: 'Analyze', icon: Icons.Chart },
                { id: Tab.GURU_CHAT, label: 'Chat', icon: Icons.Chat },
              ].map(tab => (
                 <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center text-xs font-medium ${
                    activeTab === tab.id ? 'text-cat-800' : 'text-cat-400'
                  }`}
                >
                  <tab.icon />
                  <span className="mt-1">{tab.label}</span>
                </button>
              ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === Tab.STORE_PREVIEW && <StorePreview />}
        {activeTab === Tab.COMPETITORS && <CompetitorAnalysis />}
        {activeTab === Tab.GURU_CHAT && (
           <div className="max-w-2xl mx-auto">
             <div className="text-center mb-8">
               <h2 className="text-3xl font-serif font-bold text-cat-900">Consult the Guru.</h2>
               <p className="text-cat-600">Get instant advice on strategy, marketing, and cat psychology.</p>
             </div>
             <GuruChat />
           </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-cat-900 text-cat-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Purrfect Ventures</h3>
            <p className="text-sm opacity-80">Empowering cat lovers to build the businesses of their dreams.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Links</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-accent cursor-pointer">About Us</li>
              <li className="hover:text-accent cursor-pointer">Careers</li>
              <li className="hover:text-accent cursor-pointer">Privacy Policy</li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-white mb-4">Newsletter</h4>
             <p className="text-sm opacity-80 mb-4">Subscribe for weekly cat business trends.</p>
             <div className="flex">
               <input type="email" placeholder="Email..." className="bg-cat-800 border-none text-white px-4 py-2 rounded-l-lg focus:ring-1 focus:ring-accent" />
               <button className="bg-accent text-cat-900 px-4 py-2 rounded-r-lg font-bold hover:bg-accent-dark">Go</button>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;