const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

exports.handler = async (event) => {
    const client = new DynamoDBClient({ region: "ap-south-1" });

    const userId = event.request.userAttributes.sub;
    const name = event.userName;
    const createdAt = new Date().toISOString();
    const updatedAt = new Date().toISOString();
    const phonenumber=event.request.userAttributes.phone_number;
    const email=event.request.userAttributes.email;
 console.log(event.request.userAttributes.sub);
 console.log(event);
 console.log(event.request.userAttributes.email);
    if (!userId) {
        console.error("Missing required attributes: sub or email");
        return;
    }

    if (!name) {
      console.error("Missing required attributes: sub or email");
      return;
  }

    const tableName = process.env.USERTABLE;

    const command = new PutItemCommand({
        TableName: tableName,
        Item: {
            id: { S: userId },               // String
            name: { S: name },
            email:{S:email},
            phonenumber:{S:phonenumber},               // String
            createdAt: { S: createdAt },     // String
            updatedAt: { S: updatedAt },     // String
            __typename: { S: 'User' },       // String
        },
    });

    try {
        await client.send(command);
        console.log(`User ${userId} added to DynamoDB`);
    } catch (error) {
        console.error("Error saving user data to DynamoDB:", error);
        throw new Error("Error saving user data to DynamoDB");
    }

    return event;
};
