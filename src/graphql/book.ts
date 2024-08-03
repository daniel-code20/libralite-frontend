import { gql } from "../__generated__/gql";
import { BOOK_FRAGMENT } from "./fragment/bookFragment";

export const GET_BOOKS = gql(`
  ${BOOK_FRAGMENT}
  query GetBook{
    books{
      ...BookFragment
    }
  }
`);
