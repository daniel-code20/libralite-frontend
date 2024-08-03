import { gql } from '@apollo/client';

export const GET_ALL_GENDERS = gql`
  query Genders($id: ID!) {
    genders(where: { id: { equals: $id } }) {
      id
      name
      image {
        url
      }
      books {
        id
        title
        image {
          url
        }
        author {
          name
        }
        price
        gender {
          id
          name
        }
      }
    }
  }
`;

export const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    reviews {
      rating
      book {
        id
      }
    }
  }
`;

export const UPDATE_BOOK_STOCK_MUTATION = gql`
  mutation UpdateBookStock($id: ID!, $quantity: Int!) {
    updateBook(
      where: { id: $id }
      data: { quantity: $quantity }
    ) {
      id
      quantity
    }
  }
`;