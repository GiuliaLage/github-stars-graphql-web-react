export interface SearchedUserData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
  starredRepositories: SearchedUserStarredRepositoriesData[];
}

export interface SearchedUserStarredRepositoriesData {
  id: string;
  url: string;
  nameWithOwner: string;
  stargazerCount: number;
  description: string;
  hasStarred: boolean;
}

export interface SearchedUserResponse {
  node: {
    id: string;
    avatarUrl: string;
    bio: string;
    email: string;
    location: string;
    name: string;
    url: string;
    starredRepositories: {
      edges: SearchedUserRepositoriesResponse[];
    };
  };
}

export interface SearchedUserRepositoriesResponse {
  node: {
    id: string;
    url: string;
    nameWithOwner: string;
    stargazerCount: number;
    description: string;
  };
}
