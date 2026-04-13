import React from 'react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl w-full h-16 shadow-sm shadow-purple-500/5">
      <div className="h-full px-4 md:px-8 flex justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          <div className="hidden md:block w-64 lg:w-96">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">search</span>
              <input 
                className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-container transition-all" 
                placeholder="Search doctors, appointments..." 
                type="text" 
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <button className="relative p-2 text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>

          <div className="flex items-center gap-3 pl-2 md:pl-6 border-l border-outline-variant/30 h-8">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-on-surface">Member</p>
              <p className="text-[10px] text-on-surface-variant line-clamp-1">Account Ready</p>
            </div>
            <span className="material-symbols-outlined text-3xl text-primary">account_circle</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
