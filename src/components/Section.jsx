import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import NodeCard from './NodeCard';

const Section = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-l-2 border-gray-800 ml-2 pl-4 pb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full text-left group mb-3 focus:outline-none"
      >
        <div className={`p-1 rounded transition-colors ${isOpen ? 'bg-blue-600/20 text-blue-400' : 'text-gray-600 group-hover:text-blue-400'}`}>
          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </div>
        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isOpen ? 'text-blue-400' : 'text-gray-400 group-hover:text-gray-200'}`}>
          {section.name}
        </span>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {section.nodes.map((node, idx) => (
            <NodeCard key={idx} node={node} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Section;