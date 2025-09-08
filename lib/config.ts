export const config = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  },
  googleDrive: {
    clientId: process.env.GOOGLE_DRIVE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_DRIVE_CLIENT_SECRET!,
    refreshToken: process.env.GOOGLE_DRIVE_REFRESH_TOKEN!,
    folderId: process.env.GOOGLE_DRIVE_FOLDER_ID!,
  },
  fileStorage: {
    provider: process.env.FILE_STORAGE_PROVIDER || 'google_drive',
    baseUrl: process.env.FILE_STORAGE_BASE_URL || 'https://drive.google.com/uc?id=',
    externalApiUrl: process.env.EXTERNAL_API_URL,
  },
  app: {
    nextAuthSecret: process.env.NEXTAUTH_SECRET!,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
} as const;

export type FileStorageProvider = 'google_drive' | 'supabase' | 'external';
