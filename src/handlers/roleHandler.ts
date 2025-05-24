import axios from 'axios';

import getMgmtToken from '@/config/managementToken';

import { IRolePayload } from '@/types/Login';

export default async function setUserRole(payload: IRolePayload) {
  try {
    const mgmtToken = await getMgmtToken();
    await axios.post(
      `https://YOUR_DOMAIN/api/v2/users/${payload.userId}/roles`,
      { roles: [payload.roleId] },
      {
        headers: { Authorization: `Bearer ${mgmtToken}` },
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.response?.data || error.message);
  }
}
