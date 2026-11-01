#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'yormancastellanos.com' > CNAME

git init
git add -A
if ! git diff --cached --quiet; then
  git commit -m 'deploy'
else
  echo 'No build changes to commit; publishing the existing commit.'
fi

# if you are deploying to https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f https://github.com/yormancast/three-d.git HEAD:gh-pages

cd -
