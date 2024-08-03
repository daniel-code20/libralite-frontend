import { gql } from "../__generated__/gql";
import { AUTHOR_FRAGMENT } from "./fragment/authorFragment";

export const GET_AUTHORS = gql(`
  ${AUTHOR_FRAGMENT}
  query GetAuthor{
    authors{
      ...AuthorFragment
    }
  }
`);
