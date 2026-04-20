const fs = require('fs');
const path = require('path');

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            // Add JSDoc for default export functional components
            const funcRegex = /export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*\{/g;
            content = content.replace(funcRegex, (match, name, params) => {
                // Check if there's already a JSDoc above it
                const idx = content.indexOf(match);
                const textBefore = content.substring(Math.max(0, idx - 100), idx);
                if (textBefore.includes('*/')) return match;
                
                let paramsDoc = '';
                if (params && params.trim()) {
                    paramsDoc = `\n * @param {Object} props - The component props\n * @param {any} props.${params.replace(/[{}]/g, '').trim()} - Props`;
                }
                
                return `/**\n * ${name} Component\n * @component${paramsDoc}\n * @returns {React.ReactElement} The rendered component\n */\n${match}`;
            });
            
            // Add JSDoc for named exports
            const constRegex = /export\s+const\s+([A-Za-z0-9_]+)\s*=\s*(?:async\s*)?\(([^)]*)\)\s*=>/g;
            content = content.replace(constRegex, (match, name, params) => {
                const idx = content.indexOf(match);
                const textBefore = content.substring(Math.max(0, idx - 100), idx);
                if (textBefore.includes('*/')) return match;
                return `/**\n * ${name}\n * @function\n * @param {any} params - Parameters\n * @returns {any} result\n */\n${match}`;
            });

            fs.writeFileSync(fullPath, content);
        }
    }
}

processDir('src/components');
processDir('src/pages');
console.log('JSDoc added.');
