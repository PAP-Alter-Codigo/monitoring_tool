# 🔐 Configuración de Google OAuth para Google Login

## Objetivo

Configurar las credenciales de Google OAuth necesarias para habilitar inicio de sesión con Google en el proyecto.

Las variables requeridas son:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=
```

## Requisitos previos

- Tener una cuenta de Google.
- Tener acceso a Google Cloud Console.
- Tener un proyecto creado en Google Cloud.
- Tener definido el callback URL del backend.

## 1. Crear o seleccionar un proyecto en Google Cloud

1. Ingresa a:

```txt
https://console.cloud.google.com
```

2. En la parte superior, selecciona un proyecto existente o crea uno nuevo.

3. Asegúrate de estar trabajando dentro del proyecto correcto.

## 2. Configurar la pantalla de consentimiento OAuth

1. En el menú lateral, ve a:

```txt
APIs & Services > OAuth consent screen
```

2. Configura la información básica de la aplicación:
    - Nombre de la app.
    - Correo de soporte.
    - Información del desarrollador.
    - Dominios autorizados, si aplica.

3. Guarda los cambios.

## 3. Crear credenciales OAuth

1. En el menú lateral, ve a:

```txt
APIs & Services > Credentials
```

2. Haz clic en:

```txt
+ Create Credentials
```

3. Selecciona:

```txt
OAuth client ID
```

4. En **Application type**, selecciona:

```txt
Web application
```

5. Agrega un nombre descriptivo.

Ejemplo:

```txt
Muninn Google Login
```

## 4. Configurar Authorized JavaScript origins

En esta sección agrega la URL base del frontend.

Ejemplo para producción:

```txt
https://main.d2mvdor2xa6h3m.amplifyapp.com
```

Ejemplo para desarrollo local:

```txt
http://localhost:3000
```

> Nota: no agregues rutas como `/dashboard` o `/auth/google/callback` en esta sección. Aquí solo va el origen base.

## 5. Configurar Authorized redirect URIs

Aquí debes agregar la URL exacta del callback del backend.

Ejemplo para producción:

```txt
https://ex20ps9ia1.execute-api.us-east-2.amazonaws.com/auth/google/callback
```

Ejemplo para desarrollo local:

```txt
http://localhost:3000/auth/google/callback
```

> Importante: esta URL debe coincidir exactamente con la variable `GOOGLE_CALLBACK_URL` usada en el backend.

## 6. Obtener Client ID y Client Secret

Después de crear el OAuth Client, Google mostrará dos valores:

```txt
Client ID
Client Secret
```

Copia ambos valores y guárdalos de forma segura.

## 7. Configurar variables en el archivo `.env`

Agrega las siguientes variables al archivo `.env` del backend:

```env
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=https://ex20ps9ia1.execute-api.us-east-2.amazonaws.com/auth/google/callback
```

Ejemplo:

```env
GOOGLE_CLIENT_ID=1234567890-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
GOOGLE_CALLBACK_URL=https://ex20ps9ia1.execute-api.us-east-2.amazonaws.com/auth/google/callback
```

## 8. Configurar variables en AWS Lambda

Si el backend está desplegado en Lambda, también debes agregar estas variables en la configuración de la función.

### Variables necesarias

```env
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
GOOGLE_CALLBACK_URL=https://ex20ps9ia1.execute-api.us-east-2.amazonaws.com/auth/google/callback
```

## 9. Validación

Para validar que la configuración funciona correctamente:

1. Inicia el flujo de login con Google desde el frontend.

2. Google debe mostrar la pantalla de autorización.

3. Después de aceptar, Google debe redirigir al backend usando la URL configurada en `GOOGLE_CALLBACK_URL`.

4. El backend debe recibir el `code` de Google y completar el proceso de autenticación.

## Errores comunes

### `redirect_uri_mismatch`

Este error ocurre cuando la URL del callback enviada por el backend no coincide exactamente con la configurada en Google Cloud.

Verifica que estos dos valores sean iguales:

```env
GOOGLE_CALLBACK_URL=https://ex20ps9ia1.execute-api.us-east-2.amazonaws.com/auth/google/callback
```

Y en Google Cloud:

```txt
Authorized redirect URIs:
https://ex20ps9ia1.execute-api.us-east-2.amazonaws.com/auth/google/callback
```

### `Unauthorized` o error al intercambiar el code

Puede ocurrir si:

- El `GOOGLE_CLIENT_ID` es incorrecto.
- El `GOOGLE_CLIENT_SECRET` es incorrecto.
- El callback no coincide.
- Se está usando un OAuth Client de otro proyecto.
- Las variables de entorno no están cargando correctamente en Lambda.

## Notas importantes

- No subas `GOOGLE_CLIENT_SECRET` al repositorio.
- Usa variables de entorno para desarrollo local.
- Usa secrets o environment variables en Lambda para producción.
- Mantén separados los callbacks de desarrollo y producción.
- Si cambias el dominio del frontend o backend, actualiza también la configuración en Google Cloud.
