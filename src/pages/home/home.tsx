import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { IoIosSearch } from 'react-icons/io';
import { SearchUserContext } from '../../store/searchUser';
import Logo from '../../components/logo';
import './home.scss';

const Home: React.FC = () => {
  const history = useHistory();

  const { searchUser, setSearchUser } = useContext(SearchUserContext);

  return (
    <div id="page-home">
      <div className="container">
        <Logo />
        <div className="form">
          <div className="wrapper-input-icon">
            <input
              value={searchUser}
              type="text"
              id="search-user-input"
              placeholder="github username..."
              onChange={e => setSearchUser(e.target.value)}
            />
            <button
              type="submit"
              onClick={() => history.push('/GithubStarts/dashboard')}
            >
              <IoIosSearch color="#4F4F4F" size="25px" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
