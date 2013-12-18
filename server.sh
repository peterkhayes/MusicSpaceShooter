set -u
set -e

exec 1>&2
echo "serving on 3000"
exec watchify src/* -o main.js
exec serve


trap - EXIT
