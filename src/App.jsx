import React, { useState, useMemo } from 'react';
import { Search, Terminal } from 'lucide-react';
import { WORKFLOW_DATA } from './data/workflow';
import Section from './components/Section';
import Sidebar from './components/Sidebar';

export default function App() {
  const [activeTab, setActiveTab] = useState('recon');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = useMemo(() => {
    if (!searchQuery) return WORKFLOW_DATA;
    const lowerQuery = searchQuery.toLowerCase();
    
    return WORKFLOW_DATA.map(category => ({
      ...category,
      sections: category.sections.map(section => ({
        ...section,
        nodes: section.nodes.filter(node => 
          node.label.toLowerCase().includes(lowerQuery) || 
          node.cmd.toLowerCase().includes(lowerQuery) ||
          node.leadsTo.toLowerCase().includes(lowerQuery) ||
          (node.description && node.description.toLowerCase().includes(lowerQuery))
        )
      })).filter(section => section.nodes.length > 0)
    })).filter(category => category.sections.length > 0);
  }, [searchQuery]);

  const currentCategory = filteredData.find(c => c.id === activeTab) || filteredData[0];

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col font-sans selection:bg-blue-500/30 overflow-x-hidden">
      <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-sm border-b border-gray-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded shadow-[0_0_15px_rgba(37,99,235,0.3)]">
              <Terminal className="text-white w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold tracking-tighter uppercase">AD Mindmap</h1>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Rechercher une commande..."
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col md:flex-row gap-8 min-w-0">
        <Sidebar 
          workflowData={WORKFLOW_DATA} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />

        <div className="flex-1 min-w-0 space-y-8">
          {currentCategory ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="text-blue-500">
                  {React.createElement(currentCategory.icon, { className: "w-6 h-6" })}
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight italic border-b-2 border-blue-600 pb-1 truncate">
                  {currentCategory.title}
                </h2>
              </div>
              <div className="space-y-4">
                {currentCategory.sections.map((section, idx) => (
                  <Section key={idx} section={section} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-700">
              <Search className="w-10 h-10 mb-2 opacity-20" />
              <p className="text-xs uppercase tracking-widest">Aucun résultat</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-4 border-t border-gray-900 opacity-50">
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1f2937; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
      `}</style>
    </div>
  );
}