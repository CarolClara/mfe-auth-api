import axios from 'axios';

let _cachedToken: string | null = null;

export default async function getMgmtToken() {
  if (_cachedToken) return _cachedToken;

  const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
    audience: process.env.AUTH0_AUDIENCE,
    client_id: process.env.AUTH0_MGMT_CLIENT_ID,
    client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
    grant_type: 'client_credentials',
  });

  _cachedToken = response.data.access_token;

  return _cachedToken!;
}
