const LOCAL_API_URL = 'http://localhost:3000';
const REMOTE_API_URL = import.meta.env.VITE_API_URL;

async function tryFetch(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error();
    return response;
  } catch {
    if (url === LOCAL_API_URL && REMOTE_API_URL) {
      // Tenta remoto se local falhar
      const remoteResponse = await fetch(url.replace(LOCAL_API_URL, REMOTE_API_URL), options);
      return remoteResponse;
    }
    throw new Error('Erro ao conectar com a API');
  }
}

export async function login(email, password) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha: password })
  };
  const response = await tryFetch(`${LOCAL_API_URL}/auth/login`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro ao fazer login');
  return data;
}

export async function register(email, password, nome) {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha: password, nome })
  };
  const response = await tryFetch(`${LOCAL_API_URL}/auth/register`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Erro ao cadastrar');
  return data;
} 