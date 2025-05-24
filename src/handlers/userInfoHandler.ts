import axios from 'axios';

import { Request, Response } from 'express';

import getMgmtToken from '@/config/managementToken';

import jwt from 'jsonwebtoken';

// export async function userProfileHandler(req: Request, res: Response) {
//   const token = req.signedCookies['auth_token'];
//
//   if (!token) {
//     res.status(400).json({ message: 'user_unauthenticated' });
//     return;
//   }
//
//   try {
//     const response = await axios.get(`https://${process.env.AUTH0_DOMAIN}/userinfo`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//
//     res.status(200).json(response.data);
//
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (error: any) {
//     console.error(error.response?.data || error.message);
//     res.status(401).json({ message: 'fetch_user_profile_error' });
//   }
// }

export default async function userInfoHandler(req: Request, res: Response): Promise<void> {
  const token = req.signedCookies['auth_token'];

  if (!token) {
    res.status(401).json({ message: 'unauthenticated' });
    return;
  }

  try {
    const decoded = jwt.decode(token) as { sub: string };
    const userId = decoded?.sub;

    if (!userId) {
      res.status(400).json({ message: 'invalid_token' });
      return;
    }

    const mgmtToken = await getMgmtToken();

    const userResponse = await axios.get(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
        },
      },
    );

    const userInfo = userResponse.data;

    res.status(200).json({
      createdAt: userInfo.created_at,
      email: userInfo.email,
      emailVerified: userInfo.email_verified,
      name: userInfo.name,
      picture: userInfo.picture,
      updatedAt: userInfo.updated_at,
      lastLogin: userInfo.last_login,
      loginsCount: userInfo.logins_count,
    });
  } catch (error: any) {
    console.error('Error fetching user insights:', error.response?.data || error.message);
    res.status(500).json({ message: 'error_fetching_user_insights' });
  }
}
