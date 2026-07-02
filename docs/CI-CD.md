# CI/CD Pipeline

Automated testing and deployment pipeline using GitHub Actions. Deploys to AWS Lambda on every push to `main` branch.

## Pipeline Overview

```
Push to main
    ↓
[Test Job] ← Runs tests
    ↓
[Deploy Job] ← Only runs if tests pass
    ↓
AWS Lambda Updated
```

## Jobs

### Test Job

Runs on every push to validate code before deployment.

**Steps:**

1. Checkout code
2. Setup Node.js 24
3. Install dependencies: `npm i`
4. Run tests: `npm test`

**Runner:** Ubuntu latest
**Triggers:** Any push to `main` branch

### Deploy Job

Packages and uploads function to Lambda. Only runs if Test job succeeds.

**Steps:**

1. Checkout code
2. Install production dependencies: `npm i --omit=dev`
3. Create zip package:

   ```bash
   zip -r function.zip src package.json node_modules swagger.config.json \
     -x ".env*" ".github/*" "src/test/*"
   ```

   - **Includes:** Source code, dependencies, Swagger config
   - **Excludes:** .env files, GitHub workflows, tests

4. Configure AWS credentials (from GitHub secrets)
5. Update Lambda function code:
   ```bash
   aws lambda update-function-code \
     --function-name $LAMBDA_FUNCTION_NAME \
     --zip-file fileb://function.zip
   ```

**Runner:** Ubuntu latest
**Depends on:** Test job (waits for successful test run)

## Required GitHub Secrets

Configure these in repository Settings → Secrets and variables → Actions:

| Secret                 | Purpose                           | Example               |
| ---------------------- | --------------------------------- | --------------------- |
| `AWS_ACCESS_KEY`       | AWS IAM access key                | `AKIA...`             |
| `AWS_SECRET_KEY`       | AWS IAM secret key                | `aws...`              |
| `AWS_REGION`           | AWS region for Lambda             | `us-east-2`           |
| `LAMBDA_FUNCTION_NAME` | Name of Lambda function to update | `pap-territorios-api` |

**⚠️ Important:** Never commit these values. Use GitHub's encrypted secrets only.

## Required IAM Permissions

IAM user credentials used in GitHub secrets must have permission:

- **`lambda:UpdateFunctionCode`** — Update Lambda function code

Configure in AWS IAM policy attached to user/role. Grant permission on target Lambda function or all Lambda functions.

## Environment Variables in Lambda

Lambda function requires environment variables for runtime. Configure in AWS Console or via CloudFormation:

| Variable               | Purpose                             | Example                                        |
| ---------------------- | ----------------------------------- | ---------------------------------------------- |
| `AWS_REGION`           | DynamoDB region                     | `us-east-2`                                    |
| `AWS_ACCESS_KEY`       | AWS credentials                     | `AKIA...`                                      |
| `AWS_SECRET_KEY`       | AWS credentials                     | `aws...`                                       |
| `GOOGLE_CLIENT_ID`     | OAuth client ID                     | `xxx.apps.googleusercontent.com`               |
| `GOOGLE_CLIENT_SECRET` | OAuth secret                        | `GOCSPX...`                                    |
| `GOOGLE_CALLBACK_URL`  | OAuth redirect URL                  | `https://api.example.com/auth/google/callback` |
| `IS_PRODUCTION`        | Production mode flag                | `'true'`                                       |
| `PORT`                 | Server port                         | `3000`                                         |
| `JWT_SECRET`           | JWT signing key                     | `random-secret-string`                         |
| `JWT_EXPIRES_IN`       | JWT expiration                      | `24h`                                          |
| `ADMIN_EMAILS`         | Admin user emails (comma-separated) | `user1@example.com,user2@example.com`          |
| `LAMBDA_API_KEY`       | API key for internal requests       | `secret-api-key`                               |

## Manual Deployment

Deploy without pushing to main:

```bash
# 1. Install production dependencies
npm i --omit=dev

# 2. Create deployment package
zip -r function.zip src package.json node_modules swagger.config.json \
  -x ".env*" ".github/*" "src/test/*"

# 3. Configure AWS credentials
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-2

# 4. Update Lambda
aws lambda update-function-code \
  --function-name pap-territorios-api \
  --zip-file fileb://function.zip
```

## Troubleshooting

### Tests fail

- Check test output in GitHub Actions logs
- Run locally: `npm test`
- Fix issues and push again

### Deploy fails after tests pass

**Zip creation issue:**

- Verify file paths in workflow
- Check `node_modules` exists and has dependencies

**AWS credentials issue:**

- Verify secrets are set in GitHub repository settings
- Check IAM user has `lambda:UpdateFunctionCode` permission

**Lambda update fails:**

- Verify Lambda function name matches `LAMBDA_FUNCTION_NAME` secret
- Check AWS region is correct
- Verify IAM user can access Lambda in that region

### Deployment succeeded but Lambda not updated

- Check Lambda function code in AWS Console
- Verify Handler is set to `src/lambda.handler`
- Check CloudWatch logs for runtime errors

## Rollback

If deployed code has issues:

1. **Quick rollback via AWS Console:**
   - Go to Lambda → Versions & aliases
   - Revert to previous version

2. **Via CLI:**

   ```bash
   aws lambda update-function-code \
     --function-name pap-territorios-api \
     --s3-bucket your-backup-bucket \
     --s3-key previous-function.zip
   ```

3. **Via commit revert:**
   ```bash
   git revert <commit-hash>
   git push origin main  # Triggers new deployment
   ```

## Local Testing Before Deploy

Recommended before pushing to main:

```bash
# Run tests locally
npm test

# Test on local dev server
npm run dev
```

## Future Enhancements

- Add staging environment deploy on push to `qa` branch
- Add deployment approval step
- Add automated rollback on Lambda health check failure
- Add GitHub notifications for deploy status
- Add pre-deploy smoke tests
