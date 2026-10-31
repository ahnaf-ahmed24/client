const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

async function handleResponse<T>(res: Response): Promise<T> {
  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong with the API request.");
  }

  return data;
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // কুকি বা সেশন হ্যান্ডেল করার জন্য
  });

  return handleResponse<T>(res);
}

export async function apiPost<T>(endpoint: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(res);
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  return handleResponse<T>(res);
}