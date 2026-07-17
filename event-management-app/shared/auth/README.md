# JWT compartido

Este middleware valida los tokens emitidos por `AuthService`.

El AuthService firma con `jsonwebtoken` usando:

- `JWT_SECRET`
- `JWT_ISSUER`
- `JWT_AUDIENCE`
- expiracion configurada en `JWT_EXPIRES_IN`

Claims detectados:

- `sub`: id del usuario
- `jti`: identificador unico del token
- `iat`: fecha de emision Unix
- `role`: rol principal (`ADMIN_ROLE` o `USER_ROLE`)
- `email`
- `name`
- `surname`

Uso esperado en futuros servicios Express:

```js
import { createAuthMiddleware } from '../shared/auth/validateAuthToken.js';

const validateAuthToken = createAuthMiddleware();

router.post('/events', validateAuthToken, controller.createEvent);
```

El middleware responde `401` cuando no hay token, esta vencido o es invalido. `requireRole` responde `403` cuando el token es valido pero el rol no esta permitido.
