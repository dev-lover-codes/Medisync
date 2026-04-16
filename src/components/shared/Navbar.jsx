import React from 'react';

const Navbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-3xl w-full h-20 transition-all duration-500">
      <div className="h-full px-6 md:px-12 flex justify-between items-center gap-8">
        
        {/* Left: Menu & Search */}
        <div className="flex items-center gap-6 flex-1 max-w-2xl">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-3 bg-white shadow-xl shadow-black/5 rounded-2xl hover:bg-surface-container-high transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-primary font-black">menu</span>
          </button>
          
          <div className="hidden md:block flex-1">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-all duration-300">search</span>
              <input 
                className="w-full bg-white border-none rounded-[1.5rem] pl-12 pr-6 py-4 text-[13px] font-black text-on-surface placeholder-on-surface-variant/30 focus:ring-4 focus:ring-primary/5 shadow-sm shadow-black/[0.02] transition-all group-hover:shadow-xl group-hover:shadow-black/5" 
                placeholder="Synchronize with doctors, records, or clinical modules..." 
                type="text" 
              />
            </div>
          </div>
        </div>

        {/* Right: Actions & Identity */}
        <div className="flex items-center gap-4 md:gap-10">
          <button className="relative w-12 h-12 flex items-center justify-center bg-white shadow-xl shadow-black/5 rounded-2xl text-on-surface-variant hover:text-primary transition-all active:scale-90">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
            <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-4 ring-white"></span>
          </button>

          <div className="flex items-center gap-4 px-4 py-2 hover:bg-white hover:shadow-2xl hover:shadow-black/5 rounded-[1.5rem] transition-all cursor-pointer group">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest leading-none mb-1">Status</p>
              <p className="text-[11px] font-black text-on-surface uppercase tracking-wider group-hover:text-primary transition-colors">Operational</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
               <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Navbar;

