const configuredApiUrl = import.meta.env.VITE_API_URL || '/api';
const API_BASE_URL = configuredApiUrl.replace(/\/+$/, '');
const AUTH_STORAGE_KEY = 'rediate_auth_user';

type JsonBody = Record<string, unknown>;

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | JsonBody | null;
};

function getStoredToken() {
  try {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    return storedUser ? JSON.parse(storedUser)?.token : null;
  } catch {
    return null;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const token = getStoredToken();
  const serializedBody =
    body && typeof body === 'object' && !(body instanceof FormData) && !(body instanceof URLSearchParams) && !(body instanceof Blob)
      ? JSON.stringify(body)
      : (body ?? undefined) as BodyInit | undefined;

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: {
        ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: serializedBody,
    });
  } catch {
    throw new Error(`Cannot reach the backend server at ${API_BASE_URL}. Make sure the backend is running.`);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = payload?.message || 'Request failed';
    throw new Error(message);
  }

  // Helper to recursively map _id to id
  const mapId = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(mapId);
    if (obj !== null && typeof obj === 'object') {
      const mapped = { ...obj };
      if ('_id' in obj && !('id' in obj)) {
        mapped.id = obj._id;
      }
      Object.keys(mapped).forEach(key => {
        mapped[key] = mapId(mapped[key]);
      });
      return mapped;
    }
    return obj;
  };

  return mapId(payload) as T;
}

export function resolveAssetUrl(assetPath: string) {
  if (!assetPath) return '';
  if (/^https?:\/\//i.test(assetPath)) return assetPath;

  // If API URL is '/api' (dev proxy), use current origin.
  if (configuredApiUrl.startsWith('/')) {
    return assetPath;
  }

  // If API URL is absolute and includes '/api', strip it to build asset URLs like '/uploads/...'.
  const apiOrigin = configuredApiUrl.replace(/\/api\/?$/i, '');
  return `${apiOrigin}${assetPath}`;
}

export interface ApiListResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

export interface ApiItemResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiHealthResponse {
  success: boolean;
  message: string;
  databaseState: number;
  timestamp: string;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: JsonBody) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body?: JsonBody) => request<T>(path, { method: 'PATCH', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
