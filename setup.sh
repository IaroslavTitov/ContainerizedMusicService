# export .env file's variables
export $(grep -v '^#' .env | xargs -0)

# create a local cluster
kind create cluster --name music-service-cluster

# create a namespace
kubectl apply -f infra/namespace.yaml

# create k8s secret resource
kubectl create secret generic secrets --from-literal=postgres-user="$POSTGRES_USER" --from-literal=postgres-password="$POSTGRES_PASSWORD" --from-literal=postgres-db="$POSTGRES_DB" --from-literal=prisma-url="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@postgres-service:5432/$POSTGRES_DB" -n music-service

# build the api service image
cd api
docker build -t music-service-api:latest . 
cd ..

# The reason for this tmp dir is https://kind.sigs.k8s.io/docs/user/known-issues/#docker-installed-with-snap
# a know issue with docker install with snap
mkdir -p ~/tmp

# load the image into kind
TMPDIR=~/tmp kind load docker-image -n music-service-cluster "music-service-api:latest"

# Create the rest of k8s resources
kubectl apply -f infra/resources