API_KEYS=$(aws apigateway get-api-keys --region eu-west-1 | \
    python3 -c "import sys, json; print(json.load(sys.stdin)['items'])")
# echo $API_KEYS

read -a array <<< $API_KEYS
echo $array