export type Label = {
  name: string;
}

export type Organization = {
  login: string;
  avatar_url: string;
}

export type Repository = {
  organization: Organization;
}

export type Job = {
  id: number;
  url: string;
  title: string;
  repository: Repository;
  labels: Label[];
  keywords: string[];
  created_at: string;
}

export type Company = {
  id: string;
  name: string;
  avatar_url: string;
  jobCount: number;
}

