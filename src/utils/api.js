const BASE = import.meta.env.VITE_BACK_END;

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const jsonHeader = () => ({
  "Content-Type": "application/json",
  ...authHeader(),
});

// ── Auth ──────────────────────────────────────────────
export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

export const getMe = () =>
  fetch(`${BASE}/auth/me`, { headers: authHeader() }).then((r) => r.json());

// ── User ──────────────────────────────────────────────
export const register = (formData) =>
  fetch(`${BASE}/users`, { method: "POST", body: formData }).then((r) =>
    r.json(),
  );

// ── Lapor Barang ──────────────────────────────────────
export const getLaporBarangStats = () =>
  fetch(`${BASE}/lapor-barang/stats`, { headers: authHeader() }).then((r) =>
    r.json(),
  );

export const getLaporBarangList = (page = 1, limit = 5) =>
  fetch(`${BASE}/lapor-barang?page=${page}&limit=${limit}`, {
    headers: authHeader(),
  }).then((r) => r.json());

export const createLaporan = (formData) =>
  fetch(`${BASE}/lapor-barang`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  }).then((r) => r.json());

// ── Pengajuan Klaim ───────────────────────────────────
export const getMyKlaims = () =>
  fetch(`${BASE}/pengajuan-klaim/my-klaims`, { headers: authHeader() }).then(
    (r) => r.json(),
  );

export const getKlaimStats = () =>
  fetch(`${BASE}/pengajuan-klaim/stats`, { headers: authHeader() }).then((r) =>
    r.json(),
  );

export const getPendingKlaims = (page = 1, limit = 5) =>
  fetch(`${BASE}/pengajuan-klaim?page=${page}&limit=${limit}`, {
    headers: authHeader(),
  }).then((r) => r.json());

export const createKlaim = (formData) =>
  fetch(`${BASE}/pengajuan-klaim`, {
    method: "POST",
    headers: authHeader(),
    body: formData,
  }).then((r) => r.json());
