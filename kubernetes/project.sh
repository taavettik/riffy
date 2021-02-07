export PROJECT_NAME=riffy
export HOST=riffy-dev.kukkonen.dev

if [ $PROJECT_ENV = 'prod' ]
then
  export HOST=riffy.kukkonen.dev
fi