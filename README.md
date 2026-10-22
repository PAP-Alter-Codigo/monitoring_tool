# monitoring_tool
Herramientas de monitoreo del PAP de Territorios, se encuentran las herramientas de Rest API para las tablas que se encuentran de DynamoDB de AWS

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your actual values:
```bash
cp .env.example .env
```

Required environment variables:
- `AWS_REGION` - AWS region for DynamoDB
- `AWS_ACCESS_KEY` - AWS access key
- `AWS_SECRET_KEY` - AWS secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `GOOGLE_CALLBACK_URL` - OAuth callback URL
- `SESSION_SECRET` - Strong random secret for sessions
- `IS_PRODUCTION` - Set to `true` in production to enable authentication
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)

### 3. Run the application
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```
#### Local DynamoDB Setup (Offline Development)

You can run a local instance of DynamoDB and an administrative web UI using Docker, allowing you to develop and test without needing AWS credentials or an internet connection.

#### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose installed and running.

#### A. Configure `.env`
Enable local DynamoDB in your `.env` file:

```env
USE_LOCAL_DYNAMODB=true
DYNAMODB_ENDPOINT=http://localhost:8000
```

#### B. Start DynamoDB Local
Run the containers in the background:
```bash
docker compose -f docker-compose.dynamodb.yml up -d
```

#### C. Initialize Tables
```bash
node init-local-tables.js
```

### 4. API Documentation
Swagger documentation is available at: http://localhost:3000/api-docs

## Testing
```bash
npm test
```

## Deployment
- generar un zip del proyecto sin incluir el .env o .github
- en aws lambda en la parte de code source selecciona upload from .zip