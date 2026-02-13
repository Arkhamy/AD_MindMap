import React from 'react';

const Sidebar = ({ workflowData, activeTab, setActiveTab }) => {
  return (
    <aside className="w-full md:w-56 space-y-1 shrink-0">
      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] px-2 mb-3 text-left">Phases de l'Audit</p>
      <div className="flex flex-col space-y-0.5">
        {workflowData.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded text-xs font-semibold transition-all duration-200 border text-left ${
                activeTab === cat.id 
                ? 'bg-blue-600 border-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.2)]' 
                : 'bg-transparent border-transparent text-gray-500 hover:text-gray-200 hover:bg-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{cat.title}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;