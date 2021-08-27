export interface ViewerstarredRepositoriesResponse {
  node: {
    id: string;
  };
}

export interface ViewerData {
  urlAvatar: string;
  starredRepositories: string[];
}
