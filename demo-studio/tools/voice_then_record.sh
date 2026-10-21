#!/bin/bash
# Commit + push the current work (starts the voice job when a script changed), wait for the "narration" commit, pull it, record the given videos.
# usage: voice_then_record.sh "message" "RS1 es:CO" "RS1 pt:BR" ...
cd "$(dirname "$0")/../.."
MSG="$1"; shift
exec 9>/tmp/platata-git.lock; flock 9
echo "# voice run $(date -u +%FT%TZ)" >> demo-studio/voice-ready.txt   # always touch it, so the voice job runs even if a [skip ci] save already carried the script changes
git add -A demo-studio .github .gitignore 2>/dev/null
git commit -qm "$MSG

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01CxcQsRVGpoSjQrcgYQSUer"
git pull -q --rebase origin demo-studio && git push -q origin demo-studio
H=$(git log -1 --format=%h)
flock -u 9
if true; then
  for i in $(seq 1 60); do git fetch -q origin demo-studio; git log --format=%s $H..origin/demo-studio | grep -q narration && break; sleep 30; done
  git show origin/demo-studio:demo-studio/audio/last-run.json | head -6
  flock 9; git add -A demo-studio; git commit -qm "Demos in progress [skip ci]" 2>/dev/null; git pull -q --rebase origin demo-studio; git push -q origin demo-studio; flock -u 9
fi
[ $# -gt 0 ] && demo-studio/tools/record_many.sh "$@"
