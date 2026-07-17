import jwt from 'jsonwebtoken';

function unauthorized(res, message) {
  return res.status(401).json({
    success: false,
    message,
  });
}

export function createAuthMiddleware(options = {}) {
  const secret = options.secret || process.env.JWT_SECRET;
  const issuer = options.issuer || process.env.JWT_ISSUER;
  const audience = options.audience || process.env.JWT_AUDIENCE;
  const algorithms = options.algorithm
    ? [options.algorithm]
    : options.algorithms || undefined;

  if (!secret) {
    throw new Error('JWT_SECRET es requerido para validar tokens.');
  }

  return function validateAuthToken(req, res, next) {
    const authHeader = req.header('authorization') || req.header('Authorization');

    if (!authHeader) {
      return unauthorized(res, 'No hay token en la peticion');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (!token) {
      return unauthorized(res, 'Token malformado o vacio');
    }

    try {
      const decoded = jwt.verify(token, secret, {
        issuer,
        audience,
        algorithms,
      });

      req.auth = {
        userId: decoded.sub,
        role: decoded.role,
        email: decoded.email,
        name: decoded.name,
        surname: decoded.surname,
        claims: decoded,
      };

      return next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return unauthorized(res, 'Token expirado');
      }

      return unauthorized(res, 'Token invalido');
    }
  };
}

export function requireRole(roles = []) {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return function validateRole(req, res, next) {
    if (!allowedRoles.length || allowedRoles.includes(req.auth?.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'No tienes permisos para realizar esta accion',
    });
  };
}
