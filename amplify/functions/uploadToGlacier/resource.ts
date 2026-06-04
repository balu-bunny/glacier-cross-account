import { defineFunction } from '@aws-amplify/backend';

export const uploadToGlacier = defineFunction({
  name: 'uploadToGlacier',
  entry: './handler.ts',
  timeoutSeconds: 900,
  runtime: 20,
  environment: {
    // Set these in Amplify Console → Environment variables
    // Example: arn:aws:iam::123456789012:role/CrossAccountS3GlacierRole
    CROSS_ACCOUNT_ROLE_ARN: process.env.CROSS_ACCOUNT_ROLE_ARN || '',
    // Example: my-glacier-bucket
    CROSS_ACCOUNT_BUCKET: process.env.CROSS_ACCOUNT_BUCKET || '',
    // Example: us-east-1
    CROSS_ACCOUNT_REGION: process.env.CROSS_ACCOUNT_REGION || 'us-east-1',
  },
});
