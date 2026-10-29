// Minimal Stripe REST client (no dependency). Key comes ONLY from env STRIPE_API_KEY
// (on oc-misha: ~/.openclaw/.env). Never commit keys. Restricted keys (rk_...) are preferred.
export const key = process.env.STRIPE_API_KEY || '';
export const mode = key.includes('_live_') ? 'live' : key.includes('_test_') ? 'test' : 'none';

function enc(obj, prefix = '', out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const name = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') enc(v, name, out); else out.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(v))}`);
  }
  return out;
}

export async function stripe(method, path, params) {
  if (!key) throw new Error('STRIPE_API_KEY not set');
  let url = 'https://api.stripe.com/v1' + path;
  const init = { method, headers: { Authorization: 'Bearer ' + key, 'Stripe-Version': '2024-06-20' } };
  if (params && method === 'GET') url += '?' + enc(params).join('&');
  else if (params) { init.body = enc(params).join('&'); init.headers['Content-Type'] = 'application/x-www-form-urlencoded'; }
  const res = await fetch(url, init);
  const json = await res.json();
  if (!res.ok) throw new Error(`Stripe ${method} ${path}: ${json.error?.message || res.status}`);
  return json;
}
