import axios from 'axios';

import { Request, Response } from 'express';

import getMgmtToken from '@/config/managementToken';

import { IRegisterPayload } from '@/types/Login';
import { IUser } from '@/types/User';

import setUserRole from '@/handlers/roleHandler';

export default async function registerHandler(
  req: Request<object, object, IRegisterPayload>,
  res: Response,
): Promise<void> {
  const { name, email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'empty_user_credentials' });
    return;
  }

  try {
    const mgmtToken = await getMgmtToken();

    const response: IUser = await axios.post(
      `https://${process.env.AUTH0_DOMAIN}/api/v2/users`,
      {
        name,
        nickname: name.split(' ')[0],
        email,
        password,
        connection: process.env.AUTH0_DB_CONNECTION,
        user_metadata: {
          type: 'user',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${mgmtToken}`,
        },
      },
    );

    await setUserRole({ userId: response.user_id, roleId: 'rol_NjoWORBNteyCcKCq' });

    res.status(201).json({ message: 'user_registered' });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'register_user_error' });
  }
}
