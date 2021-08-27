import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import apolloClient from './services/apolloClient/apollo';
import Routes from './routes/routes';
import { SearchUserProvider } from './store/searchUser';

import './index.scss';
import Authentication from './pages/authentication/authentication';

ReactDOM.render(
  <ApolloProvider client={apolloClient}>
    <SearchUserProvider>
      <Routes>
        <Authentication />
      </Routes>
    </SearchUserProvider>
  </ApolloProvider>,

  document.getElementById('root'),
);
