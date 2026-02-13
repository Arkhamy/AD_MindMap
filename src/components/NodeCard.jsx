import React, { useState } from 'react';
import { Copy, CheckCircle2, ArrowRight, Target } from 'lucide-react';

const NodeCard = ({ node }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const el = document.createElement('textarea');
    el.value = node.cmd;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group flex flex-col gap-2 bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 hover:border-blue-500 transition-all duration-300 w-full overflow-hidden">
      <div className="flex items-center gap-4 w-full min-w-0">
        {/* Colonne Commande */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{node.label}</span>
            <button 
              onClick={handleCopy}
              className="text-gray-600 hover:text-blue-400 transition-colors ml-2 shrink-0"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          {/* CASE À TAILLE FIXE avec défilement horizontal */}
          <div className="bg-black rounded border border-gray-900 h-11 flex items-center px-3 overflow-x-auto custom-scrollbar">
            <code className="text-xs text-blue-400 font-mono whitespace-nowrap">
              {node.cmd}
            </code>
          </div>
        </div>

        <ArrowRight className="w-5 h-5 text-gray-700 shrink-0 group-hover:text-blue-500 transition-colors" />

        {/* Colonne Destination */}
        <div className="w-48 shrink-0 flex items-center gap-2 bg-gray-900/30 border border-gray-800 px-3 py-2 rounded self-center">
          <Target className="w-3 h-3 text-blue-500 shrink-0" />
          <span className="text-[10px] font-black uppercase text-gray-300 tracking-tight leading-tight truncate">
            {node.leadsTo}
          </span>
        </div>
      </div>
      
      {node.description && (
        <div className="mt-1 pl-2 border-l-2 border-gray-800 text-[10px] text-gray-500 italic">
          {node.description}
        </div>
      )}
    </div>
  );
};

export default NodeCard;