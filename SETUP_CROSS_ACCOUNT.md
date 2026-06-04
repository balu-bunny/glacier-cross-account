# Cross-Account Setup Guide

## Prerequisites
- Two AWS accounts:
  - **Source Account**: Where Amplify app is deployed
  - **Target Account**: Where S3 Glacier bucket will store files

## Step 1: Get Your Source Account ID

In your **Source Account** (where Amplify is running):
```bash
aws sts get-caller-identity --query Account --output text
```
Save this Account ID (e.g., `111111111111`)

## Step 2: Create S3 Bucket in Target Account

In your **Target Account**:
```bash
# Create the bucket
aws s3 mb s3://YOUR-GLACIER-BUCKET-NAME --region us-east-1

# Optional: Enable versioning
aws s3api put-bucket-versioning \
  --bucket YOUR-GLACIER-BUCKET-NAME \
  --versioning-configuration Status=Enabled
```

## Step 3: Create IAM Role in Target Account

Create `trust-policy.json` with your Source Account ID:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::111111111111:root"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
```

Create the role:
```bash
aws iam create-role \
  --role-name CrossAccountS3GlacierRole \
  --assume-role-policy-document file://trust-policy.json
```

Create `role-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR-GLACIER-BUCKET-NAME",
        "arn:aws:s3:::YOUR-GLACIER-BUCKET-NAME/*"
      ]
    }
  ]
}
```

Attach the policy:
```bash
aws iam put-role-policy \
  --role-name CrossAccountS3GlacierRole \
  --policy-name S3GlacierAccess \
  --policy-document file://role-policy.json
```

Get the Role ARN:
```bash
aws iam get-role --role-name CrossAccountS3GlacierRole --query Role.Arn --output text
```
Save this ARN (e.g., `arn:aws:iam::222222222222:role/CrossAccountS3GlacierRole`)

## Step 4: Grant Source Account Permission to Assume Role

In your **Source Account**, ensure the Lambda execution role has permission to assume the cross-account role. This is automatically handled by Amplify, but verify the Lambda functions have `sts:AssumeRole` permission.

## Step 5: Configure Amplify Environment Variables

Go to AWS Amplify Console → Your App → Environment variables and add:

```
CROSS_ACCOUNT_ROLE_ARN = arn:aws:iam::222222222222:role/CrossAccountS3GlacierRole
CROSS_ACCOUNT_BUCKET = YOUR-GLACIER-BUCKET-NAME
CROSS_ACCOUNT_REGION = us-east-1
```

## Step 6: Redeploy

After setting the environment variables, trigger a new deployment in Amplify Console.

## Testing

Once deployed, test by:
1. Sign up/sign in to your app
2. Try uploading a file
3. Check the S3 bucket in the target account
4. Verify files are stored with GLACIER storage class

## Troubleshooting

If you see "Cross-account configuration missing":
- Verify environment variables are set in Amplify Console
- Check the IAM role exists and has correct trust policy
- Verify the role ARN format is correct
- Ensure the S3 bucket exists in the target account
