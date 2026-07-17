import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { AppError } from '../utils/app-error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadRoot = path.resolve(__dirname, '../../uploads/events');

fs.mkdirSync(uploadRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadRoot),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

function fileFilter(req, file, cb) {
  if (!file.mimetype?.startsWith('image/')) {
    cb(new AppError('La imagen del evento debe ser un archivo de imagen', 400));
    return;
  }

  cb(null, true);
}

export const uploadEventImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
}).single('eventImage');

export function handleUploadError(error, req, res, next) {
  if (!error) return next();

  if (error instanceof multer.MulterError) {
    return next(new AppError('No se pudo procesar la imagen del evento', 400));
  }

  return next(error);
}

export function buildEventImageUrl(req) {
  if (!req.file) return '';
  return `${req.protocol}://${req.get('host')}/uploads/events/${req.file.filename}`;
}
