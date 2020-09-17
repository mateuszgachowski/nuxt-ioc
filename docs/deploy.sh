#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd src/.vuepress/dist

git init
git add -A
git commit -m 'Deploy docs'

git push -f git@github.com:mateuszgachowski/nuxt-ioc.git master:gh-pages

cd -