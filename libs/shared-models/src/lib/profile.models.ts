export interface UpdateProfile {
  firstName: string;
  lastName: string;
}

export interface Profile extends UpdateProfile {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AvatarResponse {
  avatarUrl: string;
  expiresAt: string;
}
