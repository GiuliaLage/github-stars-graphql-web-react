import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { IoIosSearch } from 'react-icons/io';
import { BiStar } from 'react-icons/bi';
import { HiOutlineMail, HiOutlineLocationMarker } from 'react-icons/hi';
import { SearchUserContext } from '../../store/searchUser';
import {
  SearchedUserData,
  SearchedUserStarredRepositoriesData,
  SearchedUserResponse,
  SearchedUserRepositoriesResponse,
} from '../../interfaces/searchedUser';
import useDebounce from '../../hooks/debounce';
import Logo from '../../components/logo';
import NotFoundIcon from '../../assets/general/notFound.svg';
import './dashboard.scss';
import {
  ViewerData,
  ViewerstarredRepositoriesResponse,
} from '../../interfaces/viewer';
import GET_VIEWER_INFO from '../../services/api/viewer-models';
import GET_USER_QUERY from '../../services/api/user-model';
import { STAR_REPO, UNSTAR_REPO } from '../../services/api/repositories-model';

const Dashboard: React.FC = () => {
  const { searchUser } = useContext(SearchUserContext);
  const { data: searchedUserResponse, refetch: refetchUser } = useQuery(
    GET_USER_QUERY,
    {
      variables: { user: searchUser },
    },
  );
  const [searcheUserData, setSearcheUserData] = useState<
    Partial<SearchedUserData>
  >({});
  const [searchedUserValue, setSearchedUserValue] = useState('');
  const debouncedValue = useDebounce<string>(searchedUserValue, 500);

  const [viewerData, setViewerData] = useState<Partial<ViewerData>>({});
  const { data: viewerResponse, refetch: refetchViewer } =
    useQuery(GET_VIEWER_INFO);

  const history = useHistory();

  useEffect(() => {
    if (searchUser === '') {
      history.push('GithubStarts/home');
    }
    // eslint-disable-next-line
  }, []);

  const [unstar, { data: unstarData }] = useMutation(UNSTAR_REPO);

  const [star, { data: starData }] = useMutation(STAR_REPO);

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
    // eslint-disable-next-line
  }, [searchedUserResponse, viewerData]);

  const getUserDebounce = async () => {
    await refetchUser({ user: searchedUserValue });
  };

  const bringNewData = async () => {
    await refetchViewer();
  };

  useEffect(() => {
    if (starData || unstarData) {
      bringNewData();
    }
    // eslint-disable-next-line
  }, [starData, unstarData]);

  const handleStarRepo = (repoId: string, hasStarred: boolean) => {
    if (hasStarred) {
      unstar({ variables: { repoId } });
    } else {
      star({ variables: { repoId } });
    }
  };

  useEffect(() => {
    if (debouncedValue) {
      getUserDebounce();
    }
    // eslint-disable-next-line
  }, [debouncedValue]);

  const handleSearchUser = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedUserValue(e.target.value);
  };

  return (
    <div id="page">
      <div className="page-container">
        <div className="container-search">
          <Logo />
          <div className="form">
            <div
              className="wrapper-input-icon-onlyLine"
              id="container-onlyLine"
            >
              <input
                onChange={handleSearchUser}
                type="text"
                id="search-user-input"
                placeholder="github username..."
              />
              <button type="submit">
                <IoIosSearch color="#4F4F4F" size="25px" />
              </button>
            </div>
          </div>
          {viewerData.urlAvatar && (
            <img
              className="viewer-avatar"
              src={viewerData.urlAvatar}
              alt="viewer-avatar"
            />
          )}
        </div>
        {searcheUserData.name ? (
          <div className="cointainer-searched-user">
            <div className="cointainer-searched-user-info">
              <div className="cointainer-searched-user-info-top">
                {searcheUserData.avatarUrl && (
                  <img
                    className="avatar"
                    src={searcheUserData.avatarUrl}
                    alt="user-avatar"
                  />
                )}
                <p>{searcheUserData.name}</p>
              </div>
              <div className="cointainer-searched-user-info-bottom">
                <div className="bio">{searcheUserData.bio}</div>
                <div className="others">
                  <span>
                    <HiOutlineMail color="#E5E5E5" size="20px" />
                    {searcheUserData.email ? searcheUserData.email : '-'}
                  </span>
                  <span>
                    <HiOutlineLocationMarker color="#E5E5E5" size="20px" />
                    {searcheUserData.location ? searcheUserData.location : '-'}
                  </span>
                </div>
              </div>
            </div>
            <div className="cointainer-searched-user-repo-list">
              {searcheUserData.starredRepositories?.length === 0 && (
                <div className="empty-starred">
                  <div>Any repos starred </div>
                </div>
              )}
              {searcheUserData.starredRepositories?.map(
                (repository: SearchedUserStarredRepositoriesData) => (
                  <div className="card" key={repository.id}>
                    <div className="card-info">
                      <a
                        href={repository.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {repository.nameWithOwner}
                      </a>
                      <div className="card-info-title">
                        {' '}
                        {repository.description}
                      </div>
                      <div className="card-info-title">
                        <span>
                          {' '}
                          <BiStar color="#5152B7" size="25px" />{' '}
                          {repository.stargazerCount}
                        </span>
                      </div>
                    </div>

                    <button
                      className={
                        repository.hasStarred
                          ? 'secondary-button'
                          : 'primary-button'
                      }
                      type="button"
                      onClick={() =>
                        handleStarRepo(repository.id, repository.hasStarred)
                      }
                    >
                      {repository.hasStarred ? 'unstar' : 'star'}
                    </button>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : (
          <div className="not-found">
            <img src={NotFoundIcon} alt="not-found-icon" />
            <div className="title">User Not Found</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
