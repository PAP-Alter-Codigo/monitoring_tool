# 🔐 Actualización de variables `.env` en AWS Lambda

## Objetivo

Actualizar las variables de configuración utilizadas por una función Lambda.

En AWS Lambda no se utiliza directamente un archivo `.env` como en desarrollo local.  
En su lugar, las variables se configuran como:

- **Environment variables** dentro de la Lambda.
- **Secrets** en AWS Secrets Manager, para valores sensibles como API keys, client secrets o credenciales.

## Variables comunes del proyecto

Ejemplo de variables utilizadas por la Lambda:

```env
OPENAI_API_KEY=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
FRONTEND_URL=
NODE_ENV=production
```

---

# Opción 1: Actualizar variables desde la configuración de Lambda

## Cuándo usar esta opción

Usa esta opción para variables simples o de configuración general, por ejemplo:

```env
NODE_ENV=production
FRONTEND_URL=https://main.d2mvdor2xa6h3m.amplifyapp.com
GOOGLE_CALLBACK_URL=https://ex20ps9ia1.execute-api.us-east-2.amazonaws.com/auth/google/callback
```

## Pasos

1. Ingresa a la consola de **AWS**.

2. Ve al servicio **Lambda**.

3. Selecciona la función Lambda correspondiente.

4. Entra a la pestaña:

```txt
Configuration
```

5. En el menú lateral, selecciona:

```txt
Environment variables
```

6. Haz clic en:

```txt
Edit
```

7. Agrega o modifica las variables necesarias.

Ejemplo:

```env
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxx
GOOGLE_CLIENT_ID=xxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://ex20ps9ia1.execute-api.us-east-2.amazonaws.com/auth/google/callback
FRONTEND_URL=https://main.d2mvdor2xa6h3m.amplifyapp.com
NODE_ENV=production
```

8. Haz clic en:

```txt
Save
```

## Resultado esperado

La Lambda tendrá disponibles estas variables desde el código usando `process.env`.

Ejemplo en Node.js:

```ts
const openAiKey = process.env.OPENAI_API_KEY;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleCallbackUrl = process.env.GOOGLE_CALLBACK_URL;
```
