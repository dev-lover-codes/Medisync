#!/bin/bash

echo "�� Starting Master Workspace Setup..."

echo -e "\n--- Installing Global Tools ---"
npm install -g firebase-tools vercel @_davideast/stitch-mcp --yes
npm install supabase --save-dev --yes

echo -e "\n--- 1. FIREBASE PROJECTS ---"
firebase projects:list || echo "⚠️ Firebase not authenticated. Run 'firebase login --reauth --no-localhost' later."

echo -e "\n--- 2. VERCEL PROJECTS ---"
if [ -n "$VERCEL_ACCESS_TOKEN" ]; then
  vercel project ls || true
else
  echo "⚠️ VERCEL_ACCESS_TOKEN not set. Skipping vercel project list."
fi

echo -e "\n--- 3. SUPABASE PROJECTS ---"
if [ -n "$SUPABASE_ACCESS_TOKEN" ]; then
  npx supabase projects list || true
else
  echo "⚠️ SUPABASE_ACCESS_TOKEN not set. Skipping supabase projects list."
fi

echo -e "\n--- 4. STITCH PROJECTS (Auto-closing in 3 seconds) ---"
if [ -n "$STITCH_API_KEY" ]; then
  timeout 3s npx @_davideast/stitch-mcp view --projects || true
else
  echo "⚠️ STITCH_API_KEY not set. Skipping stitch projects list."
fi

echo -e "\n--- 5. AI TOOLS & EXTENSIONS ---"
echo "Installing Cline..."
if [ -n "$CLINE_API_KEY" ]; then
  echo Y | npx -y @21st-dev/cli@latest install cline --api-key "$CLINE_API_KEY" || true
else
  echo "⚠️ CLINE_API_KEY not set. Skipping Cline installation API key setup."
  echo Y | npx -y @21st-dev/cli@latest install cline || true
fi

echo "Installing Gemini CLI..."
npm install -g @google/gemini-cli

echo "Installing Gemini Extensions..."
gemini extensions install https://github.com/gemini-cli-extensions/ralph --consent || true
gemini extensions install https://github.com/gemini-cli-extensions/stitch --consent || true
gemini extensions install https://github.com/supabase-community/gemini-extension --consent || true
gemini extensions install https://github.com/firebase/agent-skills --consent || true
gemini extensions install https://github.com/ZhanZiyuan/vercel-mcp --consent || true
gemini extensions install https://github.com/netlify/context-and-tools --consent || true

echo "Installing and Configuring Get-Shit-Done (GSD)..."
npm install -g get-shit-done-cc
npx get-shit-done-cc --gemini --global --consent || true
npx get-shit-done-cc --antigravity --global --consent || true

echo -e "\n--- 6. ANTIGRAVITY CLI ---"
echo "Downloading and bypassing permissions for Antigravity..."
curl -fsSL https://antigravity.google/cli/install.sh | bash
~/.local/bin/agy --dangerously-skip-permissions

echo -e "\n✅ Setup Complete! Your environment is ready."
