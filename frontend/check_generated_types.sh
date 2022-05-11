# copy old file + re-generate schema
mv ./src/api/__types__.ts ./src/api/__types__.ts.tmp || exit
yarn generate-types
diff ./src/api/__types__.ts ./src/api/__types__.ts.tmp > /dev/null 2>&1
type_error=$?

# clean up
mv ./src/api/__types__.ts.tmp ./src/api/__types__.ts

# check for error code
if [ $type_error -eq 0 ]
then
  echo "✅  Types up to date"
elif [ $type_error -eq 1 ]
then
  echo "❌  Types are not up to date"
  exit $type_error
else
  echo "💥  There was something wrong with the diff command"
fi

! (($type_error))
