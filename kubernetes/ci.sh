if [ $GITHUB_REF_SLUG = 'master' ]
then
  PROJECT_ENV=prod
elif [ $GITHUB_REF_SLUG = 'dev' ]
then
  PROJECT_ENV=dev
fi
echo $PROJECT_ENV