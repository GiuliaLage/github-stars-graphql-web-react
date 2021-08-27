import { gql } from '@apollo/client';

const GET_USER_QUERY = gql`
  query Search($user: String!) {
    search(query: $user, type: USER, first: 1) {
      edges {
        node {
          ... on User {
            id
            email
            name
            avatarUrl
            bio
            location
            url
            starredRepositories(first: 10) {
              edges {
                node {
                  url
                  id
                  nameWithOwner
                  stargazerCount
                  description
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default GET_USER_QUERY;
