import axios from 'axios';

import { Request, Response } from 'express';

import { ILoginPayload } from '@/types/Login';

export default async function loginHandler(
  req: Request<object, object, ILoginPayload>,
  res: Response,
): Promise<void> {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'empty_user_credentials' });
    return;
  }

  try {
    const response = await axios.post(`https://${process.env.AUTH0_DOMAIN}/oauth/token`, {
      audience: process.env.AUTH0_AUDIENCE,
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      connection: process.env.AUTH0_DB_CONNECTION,
      grant_type: 'password',
      password,
      username: email,
      scope: 'openid profile email',
    });

    const { access_token, expires_in } = response.data;

    res.cookie('auth_token', access_token, {
      httpOnly: false,
      secure: true,
      sameSite: 'none',
      domain: 'localhost',
      path: '/',
      maxAge: expires_in * 1000,
      signed: true,
    });

    res.status(200).json({ message: 'user_authenticated' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(401).json({ message: 'login_user_error' });
  }
}
