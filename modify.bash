#!/bin/sh
OLD_EMAIL='yangjiaqi2@yy.com'
CORRECT_NAME='EmiyaYang'
CORRECT_EMAIL='1038810929@qq.com'

git filter-branch --env-filter "
if test $GIT_COMMITTER_EMAIL = $OLD_EMAIL
then
    export GIT_COMMITTER_NAME=$CORRECT_NAME
    export GIT_COMMITTER_EMAIL=$CORRECT_EMAIL
fi
if test $GIT_AUTHOR_EMAIL = $OLD_EMAIL
then
    export GIT_AUTHOR_NAME=$CORRECT_NAME
    export GIT_AUTHOR_EMAIL=$CORRECT_EMAIL
fi
" --tag-name-filter cat -- --branches --tags
