#!/bin/bash
# Record several videos in parallel: each argument is "FEATURE lang:CC" (quoted). 4 at a time.
cd "$(dirname "$0")/../.."
printf '%s\n' "$@" | xargs -P 3 -I{} sh -c 'python3 demo-studio/tools/record_video.py {} > /tmp/rec-$(echo "{}" | tr " :" "__").log 2>&1 && echo "OK {}" || { echo "FAIL {}"; tail -3 /tmp/rec-$(echo "{}" | tr " :" "__").log; }'
