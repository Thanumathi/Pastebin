const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function CreatePaste(payload) {
  const res = await fetch(`${BASE_URL}/api/pastes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) throw new Error(data.error || "Failed to create paste");

  return data;
}
