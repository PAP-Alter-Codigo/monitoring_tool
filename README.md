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

### 4. API Documentation
Swagger documentation is available at: http://localhost:3000/api-docs

## Testing
```bash
npm test
```

## Deployment

El despliegue de este proyecto se realiza subiendo un archivo `.zip` directamente a una función de AWS Lambda.

> Importante: el archivo `.env` no debe subirse dentro del `.zip`.  
> Las variables de entorno deben configurarse directamente en AWS Lambda o mediante AWS Secrets Manager.

---

### 1. Preparar el proyecto para producción

Antes de generar el `.zip`, instala las dependencias del proyecto:

```bash
npm install
```

### 2. Crear el archivo `.zip`

El `.zip` debe incluir el código necesario para ejecutar la Lambda y sus dependencias.

No incluir:

```txt
.env
.git
.github
node_modules de desarrollo innecesarios
README innecesarios
archivos de pruebas
```

Sí incluir:

```txt
package.json
package-lock.json
node_modules
dist o archivos fuente necesarios
```

### 3. Subir el `.zip` a AWS Lambda

1. Ingresa a la consola de **AWS**.

2. Ve al servicio **Lambda**.

3. Selecciona la función correspondiente al proyecto:

```txt
monitoring_tool
```

4. Entra a la pestaña:

```txt
Code
```

5. En la sección **Code source**, selecciona:

```txt
Upload from
```

6. Selecciona:

```txt
.zip file
```

7. Sube el archivo:

```txt
monitoring_tool.zip
```

8. Haz clic en:

```txt
Save
```

---

### 4. Configurar variables de entorno

El archivo `.env` no se sube a Lambda.

Las variables deben configurarse desde:

```txt
Configuration > Environment variables
```

Variables requeridas:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
SESSION_SECRET=
IS_PRODUCTION=true
FRONTEND_URL=
```