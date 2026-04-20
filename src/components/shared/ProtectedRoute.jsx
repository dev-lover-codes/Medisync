import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute internal Component or utility
 * @component
 * @returns {React.ReactElement} The rendered component
 */
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  const [showRetry, setShowRetry] = React.useState(false);

  React.useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => setShowRetry(true), 7000);
    }
    return () => clearTimeout(timer);
  
     
  }, [loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-on-surface mb-2 tracking-tight">Syncing your health data...</h2>
        <p className="text-on-surface-variant font-medium max-w-xs">We're preparing your MediSync dashboard. This usually takes just a second.</p>
        
        {showRetry && (
          <div className="mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <p className="text-sm text-on-surface-variant mb-4 font-medium italic">Taking longer than expected?</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => { /* In future we could force loading false in context here */ }}
              className="block mt-4 text-xs font-bold text-primary hover:underline w-full"
            >
              Contact Support
            </button>
          </div>
        )}
      </div>
    );
  }


  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
