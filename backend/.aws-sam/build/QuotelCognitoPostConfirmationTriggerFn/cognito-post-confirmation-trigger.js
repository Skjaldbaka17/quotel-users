// ES6+ example
var { CognitoIdentityProviderClient, AdminUpdateUserAttributesCommand } =  require("@aws-sdk/client-cognito-identity-provider");
var AWS = require("aws-sdk")
const apigateway = new AWS.APIGateway({region:"eu-west-1"})

/**
 * Creates and returns an API key for the given identityId and userId.
 */
 async function __createApiKey ({ identityId, enabled }) {
  console.log(`Creating API Key for identity ID [${identityId}]`)

  let apiKey
  try {
    apiKey = await apigateway
      .createApiKey({
        description: `Dev Portal API Key for account with Identity Pool user ${identityId}`,
        enabled,
        generateDistinctId: true,
        // set the name to the cognito identity ID so we can query API Key by the
        // cognito identity
        name: `${identityId}-api-key`
      })
      .promise()
  } catch (error) {
    console.error('Failed to create API key:', error)
    throw error
  }
  console.log(`Created API key with ID [${apiKey.id}]`)
  plans = await apigateway.getUsagePlans().promise()
  freePlanId = 0
  for(var i = 0; i < plans.items.length; i++){
    plan = plans.items[i]
    if(plan.name == 'FREE'){
      freePlanId = plan.id
      break
    }
  }

  await createUsagePlanKey(apiKey.id,freePlanId)
  return apiKey
}

async function createUsagePlanKey (keyId, usagePlanId) {
  console.log(
    `Creating usage plan key for key id ${keyId} and usagePlanId ${usagePlanId}`
  )

  const params = {
    keyId,
    keyType: 'API_KEY',
    usagePlanId
  }
  data = await apigateway.createUsagePlanKey(params).promise()
  return data
}


exports.handler = async (event, context, callback) => {
    console.log(event);
    apiKey = await __createApiKey({
    identityId: event.request.userAttributes.sub,
    enabled: true,
    })
    // We only care about sign-up confirmation, not forgot-password confirmation.
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    console.info(
      'Exiting Post Confirmation trigger early because' +
        ` triggerSource=[${event.triggerSource}]` +
        ' != "PostConfirmation_ConfirmSignUp"'
    )
    // Return to Amazon Cognito
    return callback(null, event);
  }

    myConfig = new AWS.Config();
    myConfig.update({region: event.region});
    const client = new CognitoIdentityProviderClient(myConfig);

    input = {
        UserPoolId: event.userPoolId,
        UserAttributes: [{Name:"custom:api_key", Value:apiKey.value}],
        Username:event.userName
    }
    const command = new AdminUpdateUserAttributesCommand(input);
    const response = await client.send(command);

        // Return to Amazon Cognito
        callback(null, event);
};

