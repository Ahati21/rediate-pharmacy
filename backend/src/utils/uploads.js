import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { env } from '../config/env.js';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);

function sanitizeFileName(fileName = 'prescription-upload') {
  const parsed = path.parse(String(fileName));
  const safeName = parsed.name.replace(/[^a-zA-Z0-9-_]/g, '-').replace(/-+/g, '-').slice(0, 60) || 'prescription-upload';
  const safeExtension = parsed.ext.replace(/[^a-zA-Z0-9.]/g, '').slice(0, 10);
  return `${safeName}${safeExtension}`;
}

function getExtensionFromMimeType(mimeType) {
  switch (mimeType) {
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/webp':
      return '.webp';
    case 'application/pdf':
      return '.pdf';
    default:
      return '';
  }
}

function parseBase64Payload(fileContent) {
  const value = String(fileContent || '').trim();

  if (!value) {
    return null;
  }

  const dataUrlMatch = value.match(/^data:(.+);base64,(.+)$/);
  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1],
      base64Data: dataUrlMatch[2],
    };
  }

  return {
    mimeType: null,
    base64Data: value,
  };
}

export async function ensureUploadDirectory() {
  await fs.mkdir(env.uploadDir, { recursive: true });
}

export async function persistPrescriptionUpload({ fileName, fileContent, fileType }) {
  const payload = parseBase64Payload(fileContent);

  if (!payload) {
    return null;
  }

  const mimeType = fileType || payload.mimeType;
  if (!mimeType || !allowedMimeTypes.has(mimeType)) {
    throw new Error('Unsupported file type. Only JPG, PNG, WEBP, and PDF are allowed.');
  }

  const fileBuffer = Buffer.from(payload.base64Data, 'base64');

  if (!fileBuffer.length) {
    throw new Error('Uploaded file is empty');
  }

  if (fileBuffer.length > env.maxUploadSizeBytes) {
    throw new Error('Uploaded file exceeds the maximum allowed size');
  }

  await ensureUploadDirectory();

  const fallbackName = `${sanitizeFileName(fileName)}${path.extname(String(fileName || '')) ? '' : getExtensionFromMimeType(mimeType)}`;
  const finalName = `${Date.now()}-${crypto.randomUUID()}-${fallbackName}`;
  const absolutePath = path.join(env.uploadDir, finalName);

  await fs.writeFile(absolutePath, fileBuffer);

  return {
    fileName: fallbackName,
    fileUrl: `/uploads/${finalName}`,
    fileMimeType: mimeType,
    fileSize: fileBuffer.length,
  };
}
