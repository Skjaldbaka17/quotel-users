package main

import (
	"context"
	"encoding/json"
	"log"

	"github.com/aws/aws-lambda-go/lambda"
)

type CognitoEventRequest struct {
	DatasetName    string                          `json:"datasetName"`
	DatasetRecords map[string]CognitoDatasetRecord `json:"datasetRecords"`
	TriggerSource  string                          `json:"triggerSource"`
	IdentityID     string                          `json:"identityId"`
	UserPoolID     string                          `json:"userPoolId"`
	Region         string                          `json:"region"`
	Version        string                          `json:"version"`
	Request        CognitoRequest                  `json:"request"`
	Username       string                          `json:"userName"`
}

type CognitoDatasetRecord struct {
	NewValue string `json:"newValue"`
	OldValue string `json:"oldValue"`
	Op       string `json:"op"`
}

type CognitoRequest struct {
	UserAttributes struct {
		UserStatus     string `json:"cognito:user_status"`
		Email          string `json:"email"`
		Email_Verified string `json:"email_verified"`
		Sub            string `json:"sub"`
		// Identities     []Identity `json:"identities"`
		Api_Key string `json:"custom:api_key"`
	} `json:"userAttributes"`
}

// type Identity struct {
// 	UserId       string `json:"userId"`
// 	ProviderName string `json:"providerName"`
// 	ProviderType string `json:"providerType"`
// 	Primary      bool   `json:"primary"`
// 	DateCreated  int64  `json:"dateCreated"`
// }

func Handler(ctx context.Context, cognitoEvent CognitoEventRequest) (interface{}, error) {
	if cognitoEvent.TriggerSource != "PostConfirmation_ConfirmSignUp" {
		return cognitoEvent, nil
	}
	log.Printf("The Obj: %v", cognitoEvent)
	out, _ := json.Marshal(cognitoEvent.Request)
	log.Printf("Req obj: %v", string(out))
	// cognitoEvent.Request.UserAttributes.Api_Key = "maturfatur"

	return cognitoEvent, nil
}

func main() {
	lambda.Start(Handler)
}
