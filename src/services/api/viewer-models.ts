import { gql } from '@apollo/client';

const GET_VIEWER_INFO = gql`
  {
    viewer {
      avatarUrl
      starredRepositories {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

export default GET_VIEWER_INFO;
