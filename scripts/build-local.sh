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

# Copies a finished build into the vaults used for testing. Each target is skipped
# when it does not exist, so this is harmless on a machine that has neither.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PLUGIN_ID="better-paste"
ARTIFACTS=(main.js manifest.json styles.css)

for artifact in "${ARTIFACTS[@]}"; do
    if [ ! -f "$REPO_ROOT/$artifact" ]; then
        echo "❌ $artifact is missing; run the build first"
        exit 1
    fi
done

deploy() {
    local vault="$1"
    local label="$2"

    if [ ! -d "$vault" ]; then
        echo "⏭️  $label not found, skipping"
        return
    fi

    local target="$vault/.obsidian/plugins/$PLUGIN_ID"
    mkdir -p "$target"
    cp "${ARTIFACTS[@]/#/$REPO_ROOT/}" "$target/"
    echo "✅ Deployed to $label"
}

# The repository root doubles as a test vault
deploy "$REPO_ROOT" "the repo vault"
deploy "$HOME/Notes" "~/Notes"
