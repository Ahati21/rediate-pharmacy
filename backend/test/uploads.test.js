import test from 'node:test';
import assert from 'node:assert/strict';
import { persistPrescriptionUpload } from '../src/utils/uploads.js';

test('persistPrescriptionUpload stores supported base64 payloads', async () => {
  const content = Buffer.from('sample prescription file').toString('base64');

  const result = await persistPrescriptionUpload({
    fileName: 'prescription.pdf',
    fileType: 'application/pdf',
    fileContent: content,
  });

  assert.equal(result.fileName, 'prescription.pdf');
  assert.equal(result.fileMimeType, 'application/pdf');
  assert.ok(result.fileSize > 0);
  assert.match(result.fileUrl, /^\/uploads\//);
});

test('persistPrescriptionUpload rejects unsupported mime types', async () => {
  await assert.rejects(() =>
    persistPrescriptionUpload({
      fileName: 'prescription.exe',
      fileType: 'application/octet-stream',
      fileContent: Buffer.from('bad').toString('base64'),
    })
  );
});
