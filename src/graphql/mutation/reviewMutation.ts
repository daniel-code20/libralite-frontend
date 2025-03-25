import { gql } from "@apollo/client";

export const ADD_REVIEW = gql`
  mutation AddReview($data: ReviewCreateInput!) {
    createReview(data: $data) {
      id
      rating
      comment
      user {
        name
      }
      book {
        title
      }
    }
  }
`;
