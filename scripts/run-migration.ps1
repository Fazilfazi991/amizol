# Run this in PowerShell to migrate products from JSON to Supabase
# Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local

$env:NODE_PATH = "node_modules"
node scripts/migrate-products.js
