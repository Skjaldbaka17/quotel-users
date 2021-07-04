var AWS = require("aws-sdk")
const apigateway = new AWS.APIGateway({region:"eu-west-1"})

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin, //or fileStream 
  output: process.stdout
});

async function cleanUpApiKeys(){
    
    keys = await apigateway.getApiKeys().promise()
    console.log(keys)
    const it = rl[Symbol.asyncIterator]();
    for(var i = 0; i < keys.items.length; i++){
        var key = keys.items[i]
        
        console.log("Should api_key with name:" + key.name + " and id: " + key.id + " be deleted? (y/n)")
        const line1 = await it.next()
        if (line1.value == "y"){
            console.log("Deleting key:", key.name)
            result = await apigateway.deleteApiKey({apiKey: key.id}).promise()
            console.log(result)
        }
        
    }
    it.return()
}

cleanUpApiKeys()