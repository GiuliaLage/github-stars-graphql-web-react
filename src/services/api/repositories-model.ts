import { gql } from '@apollo/client';

export const STAR_REPO = gql`
  mutation AddStart($repoId: String!) {
    addStar(input: { starrableId: $repoId }) {
      starrable {
        ... on Repository {
          id
        }
      }
    }
  }
`;

export const UNSTAR_REPO = gql`
  mutation RemoveStar($repoId: String!) {
    removeStar(input: { starrableId: $repoId }) {
      starrable {
        ... on Repository {
          id
        }
      }
    }
  }
`;
