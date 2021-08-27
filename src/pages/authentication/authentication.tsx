import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ImSpinner } from 'react-icons/im';
import { useLazyQuery } from '@apollo/client';

import GET_VIEWER_INFO from '../../services/api/viewer-models';

import Logo from '../../components/logo';

import './authentication.scss';

const Authentication: React.FC = () => {
  const history = useHistory();

  const [
    getViewer,
    {
      loading: viewerResponseLoading,
      data: viewerResponse,
      error: viewerError,
    },
  ] = useLazyQuery(GET_VIEWER_INFO);

  const [personalTokenValue, setPersonalTokenValue] = useState<string | null>(
    null,
  );
  const [personalToken, setPersonalToken] = useState<string | null>(
    localStorage.getItem('personalToken'),
  );

  useEffect(() => {
    if (viewerResponse && !viewerError) {
      history.push('/GithubStarts/home');
    }
    // eslint-disable-next-line
  }, [viewerResponse]);

  useEffect(() => {
    if (personalToken) {
      getViewer();
    }
    // eslint-disable-next-line
  },[personalToken]);

  useEffect(() => {
    if (viewerError) {
      localStorage.removeItem('personalToken');
      setPersonalTokenValue(null);
    }
  }, [viewerError]);

  const handleSubmitPersonalToken = () => {
    if (personalTokenValue) {
      localStorage.setItem('personalToken', personalTokenValue);
      setPersonalToken(personalTokenValue);
    }
  };

  return (
    <div className="page">
      {!viewerResponseLoading ? (
        <div className="container">
          <Logo />
          {viewerError && (
            <span className="error-message">* Invalid Personal Token</span>
          )}
          <div className="form">
            <label className="form-input-label" htmlFor="access-token-input">
              Personal Token
            </label>
            <input
              style={viewerError && { border: '2px solid red' }}
              className="input-outline"
              type="text"
              id="access-token-input"
              onChange={e => setPersonalTokenValue(e.target.value)}
            />
            <button
              type="submit"
              className="primary-button"
              onClick={handleSubmitPersonalToken}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <ImSpinner className="icon-spinner" size="50px" color="#5152B7" />
      )}
    </div>
  );
};

export default Authentication;
