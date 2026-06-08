export interface PublicUser {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  locale: string;
  emailVerified: boolean;
}

export interface UserProfileOutput extends PublicUser {
  createdAt: string;
}

export interface UpdateProfileInput {
  displayName?: string;
  avatarUrl?: string | null;
  locale?: 'tr' | 'en';
}
