import { Request, Response } from 'express';

export default async function logoutHandler(req: Request, res: Response) {
  res.clearCookie('auth_token', {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    domain: '.localhost',
    path: '/',
    signed: true,
  });
  res.cookie('auth_token', '', {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    domain: 'localhost',
    path: '/',
    expires: new Date(0),
    signed: true,
  });
  res.status(200).json({ message: 'user_logged_out' });
}
