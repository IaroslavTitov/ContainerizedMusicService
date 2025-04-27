# start a portforward to the api and get the pid
kubectl port-forward service/api-service 8080:8080 -n music-service > /dev/null 2>&1 &
PORT_FORWARD_PID=$!
trap "kill $PORT_FORWARD_PID" EXIT

echo "Running each load test for 10 seconds."

echo "P99 latency at 1 QPS:"
oha -z 10sec -q 1 -j http://localhost:8080/search?q=a | jq '.latencyPercentiles.p99'

echo "P99 latency at 10 QPS:"
oha -z 10sec -q 10 -j http://localhost:8080/search?q=a | jq '.latencyPercentiles.p99'

echo "P99 latency at 100 QPS:"
oha -z 10sec -q 100 -j http://localhost:8080/search?q=a | jq '.latencyPercentiles.p99'

echo "P99 latency at 1000 QPS:"
oha -z 10sec -q 1000 -c 1000 -j http://localhost:8080/search?q=a | jq '.latencyPercentiles.p99'