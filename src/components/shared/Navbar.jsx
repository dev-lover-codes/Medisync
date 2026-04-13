import React from 'react';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center px-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl w-full h-16 shadow-sm shadow-purple-500/5">
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">search</span>
          <input 
            className="w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-container transition-all" 
            placeholder="Search doctors, appointments..." 
            type="text" 
          />
        </div>
      </div>

      <div className="flex items-center gap-6 ml-8">
        <button className="relative text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-outline-variant/30">
          <div className="text-right">
            <p className="text-sm font-bold text-on-surface">Sarah</p>
            <p className="text-[10px] text-on-surface-variant">Premium Member</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-primary">account_circle</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
