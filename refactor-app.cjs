const fs = require('fs');

let appContent = fs.readFileSync('src/App.jsx', 'utf8');

const importsRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['\"](\.\/pages\/[^'\"]+)['\"];?/g;
let newAppContent = appContent.replace(importsRegex, 'const $1 = React.lazy(() => import(\'$2\'));');

if (!newAppContent.includes('import React')) {
    newAppContent = newAppContent.replace("import { useState }", "import React, { useState, Suspense }");
}

if (!newAppContent.includes('<Suspense')) {
    newAppContent = newAppContent.replace('<Routes>', '<Suspense fallback={<div className=\"flex h-screen items-center justify-center\">Loading...</div>}>\n          <Routes>');
    newAppContent = newAppContent.replace('</Routes>', '</Routes>\n        </Suspense>');
}

fs.writeFileSync('src/App.jsx', newAppContent);

let mainContent = fs.readFileSync('src/main.jsx', 'utf8');
const envCheck = `
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.error('CRITICAL ERROR: Supabase environment variables are missing! Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}
`;
if (!mainContent.includes('VITE_SUPABASE_URL')) {
    mainContent = mainContent.replace('console.log("main.jsx: loading...");', envCheck + '\nconsole.log("main.jsx: loading...");');
    fs.writeFileSync('src/main.jsx', mainContent);
}
