const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

function extractPayload(data) {
  if (data && typeof data === "object" && "data" in data) {
    return data.data;
  }
  return data;
}

async function request(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const headers = opts.headers || {};
  if (opts.json !== false) headers["Content-Type"] = "application/json";
  if (!opts.noAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...opts, headers });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }

  if (!res.ok) {
    if (res.status === 401 && !opts.noAuth) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const refreshRes = await fetch(`${API_BASE}/api/v1/auth/token/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken })
        });

        const refreshData = await refreshRes.json().catch(() => null);
        if (refreshRes.ok && refreshData?.access) {
          localStorage.setItem("accessToken", refreshData.access);
          headers["Authorization"] = `Bearer ${refreshData.access}`;
          const retryRes = await fetch(url, { ...opts, headers });
          const retryText = await retryRes.text();
          let retryData = null;
          try {
            retryData = retryText ? JSON.parse(retryText) : null;
          } catch (e) {
            retryData = retryText;
          }
          if (retryRes.ok) return extractPayload(retryData);
          const retryMsg = (retryData && retryData.message) || retryText || retryRes.statusText;
          throw new Error(retryMsg);
        }
      }
    }

    const msg = (data && data.message) || text || res.statusText;
    throw new Error(msg);
  }

  return extractPayload(data);
}

export async function login(email, password) {
  const body = { email_id: email, password };
  const data = await request('/api/v1/auth/login/', { method: 'POST', body: JSON.stringify(body), noAuth: true });
  if (data && data.tokens) {
    localStorage.setItem("accessToken", data.tokens.access);
    localStorage.setItem("refreshToken", data.tokens.refresh);
    if (data.member && data.member.email_id) localStorage.setItem("userEmail", data.member.email_id);
    if (data.member && data.member.full_name) localStorage.setItem("fullName", data.member.full_name);
  }
  return data;
}

export async function signup(payload) {
  const data = await request('/api/v1/auth/signup/', { method: 'POST', body: JSON.stringify(payload), noAuth: true });
  if (data && data.tokens) {
    localStorage.setItem("accessToken", data.tokens.access);
    localStorage.setItem("refreshToken", data.tokens.refresh);
    if (data.member && data.member.email_id) localStorage.setItem("userEmail", data.member.email_id);
    if (data.member && data.member.full_name) localStorage.setItem("fullName", data.member.full_name);
  }
  return data;
}

export async function me() {
  return request('/api/v1/auth/me/');
}

export function logout() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('fullName');
}

const apiClient = { login, signup, me, logout };

export default apiClient;
