export default {
    MAX_ATTACHMENT_SIZE: 5000000,
    s3: {
        REGION: "us-west-1",
        BUCKET: "health-track-uploads"
    },
    apiGateway: {
        REGION: "us-east-2",
        URL: "https://7tgb4gbxua.execute-api.us-east-2.amazonaws.com/prod"
    },
    cognito: {
        REGION: "us-east-2",
        USER_POOL_ID: "us-east-2_RO1jOwWjW",
        APP_CLIENT_ID: "1ji7em40jepc6d2rinoa0jtd06",
        IDENTITY_POOL_ID: "us-east-2:b82dea93-df32-431d-94c6-e3e1ed483f9b"
    }
};