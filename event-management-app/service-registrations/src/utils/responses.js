export function success(res, statusCode, message, data = null, extra = {}) {
  return res.status(statusCode).json({ success: true, message, data, ...extra });
}
