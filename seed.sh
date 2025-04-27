# export .env file's variables
export $(grep -v '^#' .env | xargs -0)

# create connection string for prisma
export PRISMA_CONNECTION_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_ENDPOINT:5432/$POSTGRES_DB"

# start a portforward to the postgres db and get the pid
kubectl port-forward service/postgres-service 5432:5432 -n music-service > /dev/null 2>&1 &
PORT_FORWARD_PID=$!
trap "kill $PORT_FORWARD_PID" EXIT

cd api

# ensure all dependencies are downloaded
yarn

# create tables for the data
yarn prisma migrate dev --name init

# run the seed script
yarn tsx scripts/seed.ts