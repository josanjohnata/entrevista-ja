export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  about?: string;
  github?: string;
  linkedin?: string;
  resumeURL?: string;
  resumeName?: string;
  updatedAt: Date;
}
