
//BACKEND API CLIENT

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function apiGet(path) {
  const res = await fetch(`${BASE_URL}${path}`);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Backend API error");
  }

  return res.json();
}
