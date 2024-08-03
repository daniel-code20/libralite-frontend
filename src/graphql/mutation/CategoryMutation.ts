import { gql } from '@apollo/client';

export const CREATE_CATEGORY_MUTATION = gql`
 mutation CreateCategory($data: CategoryCreateInput!) {
    createCategory(data: $data) {
      id
      name
      image {
        id
        url
      }
    }
  }
`;
