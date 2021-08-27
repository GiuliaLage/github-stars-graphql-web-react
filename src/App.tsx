import React, { useEffect, useState, useRef } from 'react';
import { useLazyQuery, useQuery } from '@apollo/client';
import useDebounce from './hooks/debounce';
// import { token } from './services/apolloClient/apollo';
import GET_USER_QUERY from './services/api/user-model';
import GET_VIWER_INFO from './services/api/viewer-models';

interface SearchedUserResponse {
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

interface SearchedUserData {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  location: string;
  starredRepositories: SearchedUserStarredRepositoriesData[];
}

interface SearchedUserStarredRepositoriesData {
  id: string;
  url: string;
  nameWithOwner: string;
  stargazerCount: number;
  description: string;
  hasStarred: boolean;
}

interface SearchedUserRepositoriesResponse {
  node: {
    id: string;
    url: string;
    nameWithOwner: string;
    stargazerCount: number;
    description: string;
  };
}

// interface ViewerResponse {
//   viewer: {
//     avatarUrl: string;
//     starredRepositories: {
//       edges: ViewerstarredRepositoriesResponse[];
//     };
//   };
// }

interface ViewerstarredRepositoriesResponse {
  node: {
    id: string;
  };
}

interface ViewerData {
  urlAvatar: string;
  starredRepositories: string[];
}

const App: React.FC = () => {
  const [personalToken, setPersonalToken] = useState<string | null>(null);

  const [viewerData, setViewerData] = useState<Partial<ViewerData>>({});
  const [searcheUserData, setSearcheUserData] = useState<
    Partial<SearchedUserData>
  >({});

  const [
    getSearchedUser,
    {
      loading: searchedUserLoading,
      data: searchedUserResponse,
      error: searchedUserError,
    },
  ] = useLazyQuery(GET_USER_QUERY);

  const { data: viewerResponse } = useQuery(GET_VIWER_INFO);

  const [searchedUserValue, setSearchedUserValue] = useState('');
  const debouncedValue = useDebounce<string>(searchedUserValue, 500);
  const searchInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (debouncedValue) {
      getSearchedUser({
        variables: { user: searchedUserValue },
      });
    }
    // eslint-disable-next-line
  }, [debouncedValue]);

  const handleSaveToken = async () => {
    if (personalToken) {
      // token(personalToken);
    }
  };

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedUserValue(e.target.value);
  };

  useEffect(() => {
    if (searchInput.current) searchInput.current.focus();
  });

  useEffect(() => {
    if (viewerResponse) {
      const starredRepositories: string[] = [];

      viewerResponse.viewer.starredRepositories.edges.forEach(
        (viewerElement: ViewerstarredRepositoriesResponse) => {
          starredRepositories.push(viewerElement.node.id);
        },
      );

      setViewerData({
        urlAvatar: viewerResponse.viewer.avatarUrl,
        starredRepositories,
      });
    }
  }, [viewerResponse]);

  useEffect(() => {
    if (searchedUserResponse && viewerData) {
      let searchedUserInfo: Partial<SearchedUserData> = {};
      const starredRepositories: SearchedUserStarredRepositoriesData[] = [];

      searchedUserResponse.search.edges.forEach(
        (userElement: SearchedUserResponse) => {
          searchedUserInfo = {
            id: userElement.node.id,
            name: userElement.node.name,
            email: userElement.node.email,
            avatarUrl: userElement.node.avatarUrl,
            bio: userElement.node.bio,
            location: userElement.node.location,
          };

          userElement.node.starredRepositories?.edges.forEach(
            (repositoriesElement: SearchedUserRepositoriesResponse) => {
              const findRepo = viewerData.starredRepositories?.find(
                repo => repo === repositoriesElement.node.id,
              );

              starredRepositories.push({
                id: repositoriesElement.node.id,
                nameWithOwner: repositoriesElement.node.nameWithOwner,
                url: repositoriesElement.node.url,
                stargazerCount: repositoriesElement.node.stargazerCount,
                description: repositoriesElement.node.description,
                hasStarred: !!findRepo,
              });
            },
          );
        },
      );

      searchedUserInfo.starredRepositories = starredRepositories;
      setSearcheUserData(searchedUserInfo);
    }
  }, [searchedUserResponse, viewerData]);

  if (searchedUserError) return <h1>ERRO!</h1>;

  return (
    <div>
      <div>
        <input onChange={e => setPersonalToken(e.target.value)} type="text" />
        <button type="button" onClick={handleSaveToken}>
          Save Token
        </button>
        <br />
        <div>
          <input
            ref={searchInput}
            type="text"
            value={searchedUserValue}
            onChange={handleSearchUser}
          />
        </div>
        <div>
          {viewerData.urlAvatar && (
            <img src={viewerData.urlAvatar} alt="viewer-avatar" />
          )}
        </div>
        <section>
          {!searchedUserLoading && (
            <div>
              <div>
                {searcheUserData.avatarUrl && (
                  <img src={searcheUserData.avatarUrl} alt="user-avatar" />
                )}
                <p>{searcheUserData.name}</p>
                <p>{searcheUserData.email}</p>
                <p>{searcheUserData.bio}</p>
                <p>{searcheUserData.location}</p>
              </div>
              <div>
                <ul>
                  {searcheUserData.starredRepositories?.map(
                    (repository: SearchedUserStarredRepositoriesData) => (
                      <li key={repository.id}>
                        <a
                          href={repository.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {repository.nameWithOwner}
                        </a>
                        <p>
                          {repository.stargazerCount} - {repository.description}
                        </p>
                        <button type="button">
                          {repository.hasStarred ? 'unstar' : 'star'}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default App;
