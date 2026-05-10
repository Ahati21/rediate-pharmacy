# Rediate Pharmacy Backend

## 1. Create the environment file

Create `backend/.env` from `backend/.env.example`.

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/rediate_pharmacy
DB_NAME=rediate_pharmacy
AUTH_SECRET=change-this-secret-in-production
AUTH_EXPIRES_IN_HOURS=24
ADMIN_NAME=Rediate Admin
ADMIN_EMAIL=admin@rediate.com
ADMIN_PASSWORD=Admin1234
ADMIN_PHONE=
UPLOAD_DIR=
MAX_UPLOAD_SIZE_BYTES=10485760
```

## 2. Install dependencies

```bash
npm install
```

## 3. Start the backend

```bash
npm run dev
```

The API will run at `http://localhost:5000`.

On startup, the backend creates the admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD` if it does not already exist.

## 3a. Optional: seed local sample data

```bash
npm run seed
```

Test accounts created by the seed:

- `admin@rediate.com` / `Pass1234`
- `pharmacist@rediate.com` / `Pass1234`
- `customer@rediate.com` / `Pass1234`

## 4. First endpoints

- `GET /api/health`
- `GET /api/dashboard/stats` (Admin/Pharmacist only)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/medicines`
- `POST /api/medicines`
- `GET /api/pharmacists`
- `POST /api/pharmacists`
- `GET /api/prescriptions`
- `POST /api/prescriptions`
- `PATCH /api/prescriptions/:id/review`
- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/status`
- `GET /api/users`
- `POST /api/users`

## 5. Prescription uploads

`POST /api/prescriptions` can now persist uploaded prescription files locally.

Send:

- `fileName`: original filename
- `fileType`: one of `image/jpeg`, `image/png`, `image/webp`, `application/pdf`
- `fileContent`: base64 string or data URL payload

Uploaded files are served from `/uploads/...`.

## 6. Backend tests

```bash
npm test
```
