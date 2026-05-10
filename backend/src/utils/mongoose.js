import mongoose from 'mongoose';

export function isValidObjectId(value) {
  return mongoose.Types.ObjectId.isValid(value);
}

export function toPublicDocument(document) {
  if (!document) {
    return document;
  }

  const payload = typeof document.toObject === 'function' ? document.toObject() : { ...document };

  payload.id = String(payload._id);
  delete payload.password;
  delete payload.__v;

  return payload;
}
