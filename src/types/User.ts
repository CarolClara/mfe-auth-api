export interface IUser {
  user_id: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  user_metadata: Record<TUserMetadataKey, TUserMetadataValue>;
}

export type TUserMetadataKey = 'type';
export type TUserMetadataValue = 'user' | 'developer';
