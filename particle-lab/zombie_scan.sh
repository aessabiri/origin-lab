#!/bin/bash

# 1. Get all exported symbols
# Format: file:symbol
exports=$(grep -rE "^export (const|function|class|let|var|default)" src/ --include="*.js" --include="*.jsx" | sed -E 's/^([^:]+):export (const|function|class|let|var|default) ([a-zA-Z0-9_]+).*/\1:\3/')

# Also handle "export default symbol;" and "export default function symbol"
# But "export default" on its own (e.g. export default class ...) needs more care.

# For now, let's just use the list we have from the previous grep and manual inspection.

echo "Scanning for zombies..."

for entry in $exports; do
    file=$(echo $entry | cut -d: -f1)
    symbol=$(echo $entry | cut -d: -f2)
    
    # Skip symbols that are common or difficult to grep uniquely without more logic
    if [[ "$symbol" == "default" ]]; then
        # For default exports, we should grep for the file being imported
        # but that's harder. Let's skip for now or handle specifically.
        continue
    fi
    
    # Search for the symbol in all files except the one it's defined in
    count=$(grep -r "\b$symbol\b" src/ --include="*.js" --include="*.jsx" | grep -v "$file" | wc -l)
    
    if [ $count -eq 0 ]; then
        echo "ZOMBIE: $symbol in $file"
    fi
done
