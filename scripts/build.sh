#!/bin/bash

# Better Paste - Plugin for Obsidian
# Copyright (c) 2026 Johan Sanneblad
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <https://www.gnu.org/licenses/>.

# Full quality gate. Everything must pass before a build is produced, so a warning
# is as fatal as an error: the point is that the shipped artefact is never the one
# that was "nearly" clean.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

FAILURES=0

step() {
    local label="$1"
    shift

    echo ""
    echo "▶ $label"

    if output=$("$@" 2>&1); then
        echo "✅ $label"
        return 0
    fi

    echo "$output"
    echo "❌ $label"
    FAILURES=$((FAILURES + 1))
    return 1
}

# ESLint is configured to report unused disable directives as errors, so a clean
# run here also means no stale suppressions
step "ESLint" npm run lint

step "Stylelint" npm run lint:styles

step "Markdown lint" npm run lint:docs

step "TypeScript" npx tsc --noEmit --skipLibCheck

step "Unit tests" npm test

step "Formatting" npx prettier --check .

# Dead code is a warning in spirit but an error here: an unused export in a plugin
# this small always means something was left half-removed
echo ""
echo "▶ Dead code"
if knip_output=$(npx knip --no-progress 2>&1); then
    echo "✅ Dead code"
else
    echo "$knip_output"
    echo "❌ Dead code"
    FAILURES=$((FAILURES + 1))
fi

echo ""
if [ $FAILURES -gt 0 ]; then
    echo "=== $FAILURES check(s) failed; no build produced ==="
    exit 1
fi

echo "▶ Building"
if ! npm run build; then
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "=== All checks passed ==="

# Deploying into personal vaults is a local convenience, not something CI should do
if [ -z "${CI:-}" ] && [ -x "$SCRIPT_DIR/build-local.sh" ]; then
    "$SCRIPT_DIR/build-local.sh"
fi
