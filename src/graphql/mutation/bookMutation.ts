import { gql } from "@apollo/client";

export const GET_AUTHORS = gql`
  query GetAuthors {
    authors {
      ...AuthorFragment
    }
  }
`;

export const ADD_BOOK = gql`
  mutation AddBook($data: BookCreateInput!) {
    createBook(data: $data) {
      title
      edition
      author {
        name
      }
      quantity
      price
      id
    }
  }
`;
