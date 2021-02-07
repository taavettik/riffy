export PROJECT_NAME=riffy

if [ $PROJECT_ENV = 'prod' ]
then
  export HOST=riffy.kukkonen.dev
elif [ $PROJECT_ENV = 'dev' ]
then
  export HOST=riffy-dev.kukkonen.dev
fi