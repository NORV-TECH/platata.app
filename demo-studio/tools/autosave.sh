#!/bin/bash
# Save the demo work to the branch every 5 minutes ([skip ci]: never starts the voice job).
cd "$(dirname "$0")/../.."
while true; do
  ( flock 9
    git add -A demo-studio 2>/dev/null
    git diff --cached --quiet || git commit -qm "Demos in progress [skip ci]

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01CxcQsRVGpoSjQrcgYQSUer"
    git pull -q --rebase origin demo-studio && git push -q origin demo-studio
  ) 9>/tmp/platata-git.lock
  sleep 300
done
