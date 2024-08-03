/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: any; output: any; }
};

export type AuthenticatedItem = User;

export type Author = {
  __typename?: 'Author';
  biography?: Maybe<Scalars['String']['output']>;
  books?: Maybe<Array<Book>>;
  booksCount?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};


export type AuthorBooksArgs = {
  cursor?: InputMaybe<BookWhereUniqueInput>;
  orderBy?: Array<BookOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: BookWhereInput;
};


export type AuthorBooksCountArgs = {
  where?: BookWhereInput;
};

export type AuthorCreateInput = {
  biography?: InputMaybe<Scalars['String']['input']>;
  books?: InputMaybe<BookRelateToManyForCreateInput>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AuthorOrderByInput = {
  biography?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type AuthorRelateToOneForCreateInput = {
  connect?: InputMaybe<AuthorWhereUniqueInput>;
  create?: InputMaybe<AuthorCreateInput>;
};

export type AuthorRelateToOneForUpdateInput = {
  connect?: InputMaybe<AuthorWhereUniqueInput>;
  create?: InputMaybe<AuthorCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type AuthorUpdateArgs = {
  data: AuthorUpdateInput;
  where: AuthorWhereUniqueInput;
};

export type AuthorUpdateInput = {
  biography?: InputMaybe<Scalars['String']['input']>;
  books?: InputMaybe<BookRelateToManyForUpdateInput>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type AuthorWhereInput = {
  AND?: InputMaybe<Array<AuthorWhereInput>>;
  NOT?: InputMaybe<Array<AuthorWhereInput>>;
  OR?: InputMaybe<Array<AuthorWhereInput>>;
  biography?: InputMaybe<StringFilter>;
  books?: InputMaybe<BookManyRelationFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
};

export type AuthorWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Book = {
  __typename?: 'Book';
  author?: Maybe<Author>;
  edition?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  title?: Maybe<Scalars['String']['output']>;
};

export type BookCreateInput = {
  author?: InputMaybe<AuthorRelateToOneForCreateInput>;
  edition?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BookManyRelationFilter = {
  every?: InputMaybe<BookWhereInput>;
  none?: InputMaybe<BookWhereInput>;
  some?: InputMaybe<BookWhereInput>;
};

export type BookOrderByInput = {
  edition?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  price?: InputMaybe<OrderDirection>;
  quantity?: InputMaybe<OrderDirection>;
  title?: InputMaybe<OrderDirection>;
};

export type BookRelateToManyForCreateInput = {
  connect?: InputMaybe<Array<BookWhereUniqueInput>>;
  create?: InputMaybe<Array<BookCreateInput>>;
};

export type BookRelateToManyForUpdateInput = {
  connect?: InputMaybe<Array<BookWhereUniqueInput>>;
  create?: InputMaybe<Array<BookCreateInput>>;
  disconnect?: InputMaybe<Array<BookWhereUniqueInput>>;
  set?: InputMaybe<Array<BookWhereUniqueInput>>;
};

export type BookRelateToOneForCreateInput = {
  connect?: InputMaybe<BookWhereUniqueInput>;
  create?: InputMaybe<BookCreateInput>;
};

export type BookRelateToOneForUpdateInput = {
  connect?: InputMaybe<BookWhereUniqueInput>;
  create?: InputMaybe<BookCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BookUpdateArgs = {
  data: BookUpdateInput;
  where: BookWhereUniqueInput;
};

export type BookUpdateInput = {
  author?: InputMaybe<AuthorRelateToOneForUpdateInput>;
  edition?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type BookWhereInput = {
  AND?: InputMaybe<Array<BookWhereInput>>;
  NOT?: InputMaybe<Array<BookWhereInput>>;
  OR?: InputMaybe<Array<BookWhereInput>>;
  author?: InputMaybe<AuthorWhereInput>;
  edition?: InputMaybe<IntFilter>;
  id?: InputMaybe<IdFilter>;
  price?: InputMaybe<IntNullableFilter>;
  quantity?: InputMaybe<IntNullableFilter>;
  title?: InputMaybe<StringFilter>;
};

export type BookWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Buy = {
  __typename?: 'Buy';
  book?: Maybe<Book>;
  id: Scalars['ID']['output'];
  price?: Maybe<Scalars['Int']['output']>;
  purchaseDate?: Maybe<Scalars['DateTime']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
};

export type BuyCreateInput = {
  book?: InputMaybe<BookRelateToOneForCreateInput>;
  price?: InputMaybe<Scalars['Int']['input']>;
  purchaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<UserRelateToOneForCreateInput>;
};

export type BuyOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  price?: InputMaybe<OrderDirection>;
  purchaseDate?: InputMaybe<OrderDirection>;
  quantity?: InputMaybe<OrderDirection>;
};

export type BuyUpdateArgs = {
  data: BuyUpdateInput;
  where: BuyWhereUniqueInput;
};

export type BuyUpdateInput = {
  book?: InputMaybe<BookRelateToOneForUpdateInput>;
  price?: InputMaybe<Scalars['Int']['input']>;
  purchaseDate?: InputMaybe<Scalars['DateTime']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<UserRelateToOneForUpdateInput>;
};

export type BuyWhereInput = {
  AND?: InputMaybe<Array<BuyWhereInput>>;
  NOT?: InputMaybe<Array<BuyWhereInput>>;
  OR?: InputMaybe<Array<BuyWhereInput>>;
  book?: InputMaybe<BookWhereInput>;
  id?: InputMaybe<IdFilter>;
  price?: InputMaybe<IntNullableFilter>;
  purchaseDate?: InputMaybe<DateTimeNullableFilter>;
  quantity?: InputMaybe<IntNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
};

export type BuyWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Category = {
  __typename?: 'Category';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type CategoryCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryOrderByInput = {
  description?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type CategoryUpdateArgs = {
  data: CategoryUpdateInput;
  where: CategoryWhereUniqueInput;
};

export type CategoryUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CategoryWhereInput = {
  AND?: InputMaybe<Array<CategoryWhereInput>>;
  NOT?: InputMaybe<Array<CategoryWhereInput>>;
  OR?: InputMaybe<Array<CategoryWhereInput>>;
  description?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
};

export type CategoryWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type CreateInitialUserInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type DateTimeNullableFilter = {
  equals?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<Scalars['DateTime']['input']>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  not?: InputMaybe<DateTimeNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['DateTime']['input']>>;
};

export type IdFilter = {
  equals?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  gte?: InputMaybe<Scalars['ID']['input']>;
  in?: InputMaybe<Array<Scalars['ID']['input']>>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  lte?: InputMaybe<Scalars['ID']['input']>;
  not?: InputMaybe<IdFilter>;
  notIn?: InputMaybe<Array<Scalars['ID']['input']>>;
};

export type IntFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type IntNullableFilter = {
  equals?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<Scalars['Int']['input']>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  not?: InputMaybe<IntNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type KeystoneAdminMeta = {
  __typename?: 'KeystoneAdminMeta';
  list?: Maybe<KeystoneAdminUiListMeta>;
  lists: Array<KeystoneAdminUiListMeta>;
};


export type KeystoneAdminMetaListArgs = {
  key: Scalars['String']['input'];
};

export type KeystoneAdminUiFieldGroupMeta = {
  __typename?: 'KeystoneAdminUIFieldGroupMeta';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  label: Scalars['String']['output'];
};

export type KeystoneAdminUiFieldMeta = {
  __typename?: 'KeystoneAdminUIFieldMeta';
  createView: KeystoneAdminUiFieldMetaCreateView;
  customViewsIndex?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fieldMeta?: Maybe<Scalars['JSON']['output']>;
  isFilterable: Scalars['Boolean']['output'];
  isNonNull?: Maybe<Array<KeystoneAdminUiFieldMetaIsNonNull>>;
  isOrderable: Scalars['Boolean']['output'];
  itemView?: Maybe<KeystoneAdminUiFieldMetaItemView>;
  label: Scalars['String']['output'];
  listView: KeystoneAdminUiFieldMetaListView;
  path: Scalars['String']['output'];
  search?: Maybe<QueryMode>;
  viewsIndex: Scalars['Int']['output'];
};


export type KeystoneAdminUiFieldMetaItemViewArgs = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type KeystoneAdminUiFieldMetaCreateView = {
  __typename?: 'KeystoneAdminUIFieldMetaCreateView';
  fieldMode: KeystoneAdminUiFieldMetaCreateViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaCreateViewFieldMode {
  Edit = 'edit',
  Hidden = 'hidden'
}

export enum KeystoneAdminUiFieldMetaIsNonNull {
  Create = 'create',
  Read = 'read',
  Update = 'update'
}

export type KeystoneAdminUiFieldMetaItemView = {
  __typename?: 'KeystoneAdminUIFieldMetaItemView';
  fieldMode?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldMode>;
  fieldPosition?: Maybe<KeystoneAdminUiFieldMetaItemViewFieldPosition>;
};

export enum KeystoneAdminUiFieldMetaItemViewFieldMode {
  Edit = 'edit',
  Hidden = 'hidden',
  Read = 'read'
}

export enum KeystoneAdminUiFieldMetaItemViewFieldPosition {
  Form = 'form',
  Sidebar = 'sidebar'
}

export type KeystoneAdminUiFieldMetaListView = {
  __typename?: 'KeystoneAdminUIFieldMetaListView';
  fieldMode: KeystoneAdminUiFieldMetaListViewFieldMode;
};

export enum KeystoneAdminUiFieldMetaListViewFieldMode {
  Hidden = 'hidden',
  Read = 'read'
}

export type KeystoneAdminUiListMeta = {
  __typename?: 'KeystoneAdminUIListMeta';
  description?: Maybe<Scalars['String']['output']>;
  fields: Array<KeystoneAdminUiFieldMeta>;
  groups: Array<KeystoneAdminUiFieldGroupMeta>;
  hideCreate: Scalars['Boolean']['output'];
  hideDelete: Scalars['Boolean']['output'];
  initialColumns: Array<Scalars['String']['output']>;
  initialSort?: Maybe<KeystoneAdminUiSort>;
  isHidden: Scalars['Boolean']['output'];
  isSingleton: Scalars['Boolean']['output'];
  itemQueryName: Scalars['String']['output'];
  key: Scalars['String']['output'];
  label: Scalars['String']['output'];
  labelField: Scalars['String']['output'];
  listQueryName: Scalars['String']['output'];
  pageSize: Scalars['Int']['output'];
  path: Scalars['String']['output'];
  plural: Scalars['String']['output'];
  singular: Scalars['String']['output'];
};

export type KeystoneAdminUiSort = {
  __typename?: 'KeystoneAdminUISort';
  direction: KeystoneAdminUiSortDirection;
  field: Scalars['String']['output'];
};

export enum KeystoneAdminUiSortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type KeystoneMeta = {
  __typename?: 'KeystoneMeta';
  adminMeta: KeystoneAdminMeta;
};

export type Mutation = {
  __typename?: 'Mutation';
  authenticateUserWithPassword?: Maybe<UserAuthenticationWithPasswordResult>;
  createAuthor?: Maybe<Author>;
  createAuthors?: Maybe<Array<Maybe<Author>>>;
  createBook?: Maybe<Book>;
  createBooks?: Maybe<Array<Maybe<Book>>>;
  createBuy?: Maybe<Buy>;
  createBuys?: Maybe<Array<Maybe<Buy>>>;
  createCategories?: Maybe<Array<Maybe<Category>>>;
  createCategory?: Maybe<Category>;
  createInitialUser: UserAuthenticationWithPasswordSuccess;
  createPublisher?: Maybe<Publisher>;
  createPublishers?: Maybe<Array<Maybe<Publisher>>>;
  createReservation?: Maybe<Reservation>;
  createReservations?: Maybe<Array<Maybe<Reservation>>>;
  createReview?: Maybe<Review>;
  createReviews?: Maybe<Array<Maybe<Review>>>;
  createUser?: Maybe<User>;
  createUsers?: Maybe<Array<Maybe<User>>>;
  deleteAuthor?: Maybe<Author>;
  deleteAuthors?: Maybe<Array<Maybe<Author>>>;
  deleteBook?: Maybe<Book>;
  deleteBooks?: Maybe<Array<Maybe<Book>>>;
  deleteBuy?: Maybe<Buy>;
  deleteBuys?: Maybe<Array<Maybe<Buy>>>;
  deleteCategories?: Maybe<Array<Maybe<Category>>>;
  deleteCategory?: Maybe<Category>;
  deletePublisher?: Maybe<Publisher>;
  deletePublishers?: Maybe<Array<Maybe<Publisher>>>;
  deleteReservation?: Maybe<Reservation>;
  deleteReservations?: Maybe<Array<Maybe<Reservation>>>;
  deleteReview?: Maybe<Review>;
  deleteReviews?: Maybe<Array<Maybe<Review>>>;
  deleteUser?: Maybe<User>;
  deleteUsers?: Maybe<Array<Maybe<User>>>;
  endSession: Scalars['Boolean']['output'];
  updateAuthor?: Maybe<Author>;
  updateAuthors?: Maybe<Array<Maybe<Author>>>;
  updateBook?: Maybe<Book>;
  updateBooks?: Maybe<Array<Maybe<Book>>>;
  updateBuy?: Maybe<Buy>;
  updateBuys?: Maybe<Array<Maybe<Buy>>>;
  updateCategories?: Maybe<Array<Maybe<Category>>>;
  updateCategory?: Maybe<Category>;
  updatePublisher?: Maybe<Publisher>;
  updatePublishers?: Maybe<Array<Maybe<Publisher>>>;
  updateReservation?: Maybe<Reservation>;
  updateReservations?: Maybe<Array<Maybe<Reservation>>>;
  updateReview?: Maybe<Review>;
  updateReviews?: Maybe<Array<Maybe<Review>>>;
  updateUser?: Maybe<User>;
  updateUsers?: Maybe<Array<Maybe<User>>>;
};


export type MutationAuthenticateUserWithPasswordArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationCreateAuthorArgs = {
  data: AuthorCreateInput;
};


export type MutationCreateAuthorsArgs = {
  data: Array<AuthorCreateInput>;
};


export type MutationCreateBookArgs = {
  data: BookCreateInput;
};


export type MutationCreateBooksArgs = {
  data: Array<BookCreateInput>;
};


export type MutationCreateBuyArgs = {
  data: BuyCreateInput;
};


export type MutationCreateBuysArgs = {
  data: Array<BuyCreateInput>;
};


export type MutationCreateCategoriesArgs = {
  data: Array<CategoryCreateInput>;
};


export type MutationCreateCategoryArgs = {
  data: CategoryCreateInput;
};


export type MutationCreateInitialUserArgs = {
  data: CreateInitialUserInput;
};


export type MutationCreatePublisherArgs = {
  data: PublisherCreateInput;
};


export type MutationCreatePublishersArgs = {
  data: Array<PublisherCreateInput>;
};


export type MutationCreateReservationArgs = {
  data: ReservationCreateInput;
};


export type MutationCreateReservationsArgs = {
  data: Array<ReservationCreateInput>;
};


export type MutationCreateReviewArgs = {
  data: ReviewCreateInput;
};


export type MutationCreateReviewsArgs = {
  data: Array<ReviewCreateInput>;
};


export type MutationCreateUserArgs = {
  data: UserCreateInput;
};


export type MutationCreateUsersArgs = {
  data: Array<UserCreateInput>;
};


export type MutationDeleteAuthorArgs = {
  where: AuthorWhereUniqueInput;
};


export type MutationDeleteAuthorsArgs = {
  where: Array<AuthorWhereUniqueInput>;
};


export type MutationDeleteBookArgs = {
  where: BookWhereUniqueInput;
};


export type MutationDeleteBooksArgs = {
  where: Array<BookWhereUniqueInput>;
};


export type MutationDeleteBuyArgs = {
  where: BuyWhereUniqueInput;
};


export type MutationDeleteBuysArgs = {
  where: Array<BuyWhereUniqueInput>;
};


export type MutationDeleteCategoriesArgs = {
  where: Array<CategoryWhereUniqueInput>;
};


export type MutationDeleteCategoryArgs = {
  where: CategoryWhereUniqueInput;
};


export type MutationDeletePublisherArgs = {
  where: PublisherWhereUniqueInput;
};


export type MutationDeletePublishersArgs = {
  where: Array<PublisherWhereUniqueInput>;
};


export type MutationDeleteReservationArgs = {
  where: ReservationWhereUniqueInput;
};


export type MutationDeleteReservationsArgs = {
  where: Array<ReservationWhereUniqueInput>;
};


export type MutationDeleteReviewArgs = {
  where: ReviewWhereUniqueInput;
};


export type MutationDeleteReviewsArgs = {
  where: Array<ReviewWhereUniqueInput>;
};


export type MutationDeleteUserArgs = {
  where: UserWhereUniqueInput;
};


export type MutationDeleteUsersArgs = {
  where: Array<UserWhereUniqueInput>;
};


export type MutationUpdateAuthorArgs = {
  data: AuthorUpdateInput;
  where: AuthorWhereUniqueInput;
};


export type MutationUpdateAuthorsArgs = {
  data: Array<AuthorUpdateArgs>;
};


export type MutationUpdateBookArgs = {
  data: BookUpdateInput;
  where: BookWhereUniqueInput;
};


export type MutationUpdateBooksArgs = {
  data: Array<BookUpdateArgs>;
};


export type MutationUpdateBuyArgs = {
  data: BuyUpdateInput;
  where: BuyWhereUniqueInput;
};


export type MutationUpdateBuysArgs = {
  data: Array<BuyUpdateArgs>;
};


export type MutationUpdateCategoriesArgs = {
  data: Array<CategoryUpdateArgs>;
};


export type MutationUpdateCategoryArgs = {
  data: CategoryUpdateInput;
  where: CategoryWhereUniqueInput;
};


export type MutationUpdatePublisherArgs = {
  data: PublisherUpdateInput;
  where: PublisherWhereUniqueInput;
};


export type MutationUpdatePublishersArgs = {
  data: Array<PublisherUpdateArgs>;
};


export type MutationUpdateReservationArgs = {
  data: ReservationUpdateInput;
  where: ReservationWhereUniqueInput;
};


export type MutationUpdateReservationsArgs = {
  data: Array<ReservationUpdateArgs>;
};


export type MutationUpdateReviewArgs = {
  data: ReviewUpdateInput;
  where: ReviewWhereUniqueInput;
};


export type MutationUpdateReviewsArgs = {
  data: Array<ReviewUpdateArgs>;
};


export type MutationUpdateUserArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};


export type MutationUpdateUsersArgs = {
  data: Array<UserUpdateArgs>;
};

export type NestedStringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type PasswordState = {
  __typename?: 'PasswordState';
  isSet: Scalars['Boolean']['output'];
};

export type Publisher = {
  __typename?: 'Publisher';
  address?: Maybe<Scalars['String']['output']>;
  contact?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type PublisherCreateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PublisherOrderByInput = {
  address?: InputMaybe<OrderDirection>;
  contact?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type PublisherUpdateArgs = {
  data: PublisherUpdateInput;
  where: PublisherWhereUniqueInput;
};

export type PublisherUpdateInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contact?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PublisherWhereInput = {
  AND?: InputMaybe<Array<PublisherWhereInput>>;
  NOT?: InputMaybe<Array<PublisherWhereInput>>;
  OR?: InputMaybe<Array<PublisherWhereInput>>;
  address?: InputMaybe<StringFilter>;
  contact?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
};

export type PublisherWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Query = {
  __typename?: 'Query';
  authenticatedItem?: Maybe<AuthenticatedItem>;
  author?: Maybe<Author>;
  authors?: Maybe<Array<Author>>;
  authorsCount?: Maybe<Scalars['Int']['output']>;
  book?: Maybe<Book>;
  books?: Maybe<Array<Book>>;
  booksCount?: Maybe<Scalars['Int']['output']>;
  buy?: Maybe<Buy>;
  buys?: Maybe<Array<Buy>>;
  buysCount?: Maybe<Scalars['Int']['output']>;
  categories?: Maybe<Array<Category>>;
  categoriesCount?: Maybe<Scalars['Int']['output']>;
  category?: Maybe<Category>;
  keystone: KeystoneMeta;
  publisher?: Maybe<Publisher>;
  publishers?: Maybe<Array<Publisher>>;
  publishersCount?: Maybe<Scalars['Int']['output']>;
  reservation?: Maybe<Reservation>;
  reservations?: Maybe<Array<Reservation>>;
  reservationsCount?: Maybe<Scalars['Int']['output']>;
  review?: Maybe<Review>;
  reviews?: Maybe<Array<Review>>;
  reviewsCount?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  users?: Maybe<Array<User>>;
  usersCount?: Maybe<Scalars['Int']['output']>;
};


export type QueryAuthorArgs = {
  where: AuthorWhereUniqueInput;
};


export type QueryAuthorsArgs = {
  cursor?: InputMaybe<AuthorWhereUniqueInput>;
  orderBy?: Array<AuthorOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: AuthorWhereInput;
};


export type QueryAuthorsCountArgs = {
  where?: AuthorWhereInput;
};


export type QueryBookArgs = {
  where: BookWhereUniqueInput;
};


export type QueryBooksArgs = {
  cursor?: InputMaybe<BookWhereUniqueInput>;
  orderBy?: Array<BookOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: BookWhereInput;
};


export type QueryBooksCountArgs = {
  where?: BookWhereInput;
};


export type QueryBuyArgs = {
  where: BuyWhereUniqueInput;
};


export type QueryBuysArgs = {
  cursor?: InputMaybe<BuyWhereUniqueInput>;
  orderBy?: Array<BuyOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: BuyWhereInput;
};


export type QueryBuysCountArgs = {
  where?: BuyWhereInput;
};


export type QueryCategoriesArgs = {
  cursor?: InputMaybe<CategoryWhereUniqueInput>;
  orderBy?: Array<CategoryOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: CategoryWhereInput;
};


export type QueryCategoriesCountArgs = {
  where?: CategoryWhereInput;
};


export type QueryCategoryArgs = {
  where: CategoryWhereUniqueInput;
};


export type QueryPublisherArgs = {
  where: PublisherWhereUniqueInput;
};


export type QueryPublishersArgs = {
  cursor?: InputMaybe<PublisherWhereUniqueInput>;
  orderBy?: Array<PublisherOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: PublisherWhereInput;
};


export type QueryPublishersCountArgs = {
  where?: PublisherWhereInput;
};


export type QueryReservationArgs = {
  where: ReservationWhereUniqueInput;
};


export type QueryReservationsArgs = {
  cursor?: InputMaybe<ReservationWhereUniqueInput>;
  orderBy?: Array<ReservationOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ReservationWhereInput;
};


export type QueryReservationsCountArgs = {
  where?: ReservationWhereInput;
};


export type QueryReviewArgs = {
  where: ReviewWhereUniqueInput;
};


export type QueryReviewsArgs = {
  cursor?: InputMaybe<ReviewWhereUniqueInput>;
  orderBy?: Array<ReviewOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: ReviewWhereInput;
};


export type QueryReviewsCountArgs = {
  where?: ReviewWhereInput;
};


export type QueryUserArgs = {
  where: UserWhereUniqueInput;
};


export type QueryUsersArgs = {
  cursor?: InputMaybe<UserWhereUniqueInput>;
  orderBy?: Array<UserOrderByInput>;
  skip?: Scalars['Int']['input'];
  take?: InputMaybe<Scalars['Int']['input']>;
  where?: UserWhereInput;
};


export type QueryUsersCountArgs = {
  where?: UserWhereInput;
};

export enum QueryMode {
  Default = 'default',
  Insensitive = 'insensitive'
}

export type Reservation = {
  __typename?: 'Reservation';
  book?: Maybe<Book>;
  id: Scalars['ID']['output'];
  reservationDate?: Maybe<Scalars['DateTime']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type ReservationCreateInput = {
  book?: InputMaybe<BookRelateToOneForCreateInput>;
  reservationDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UserRelateToOneForCreateInput>;
};

export type ReservationOrderByInput = {
  id?: InputMaybe<OrderDirection>;
  reservationDate?: InputMaybe<OrderDirection>;
  status?: InputMaybe<OrderDirection>;
};

export type ReservationUpdateArgs = {
  data: ReservationUpdateInput;
  where: ReservationWhereUniqueInput;
};

export type ReservationUpdateInput = {
  book?: InputMaybe<BookRelateToOneForUpdateInput>;
  reservationDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UserRelateToOneForUpdateInput>;
};

export type ReservationWhereInput = {
  AND?: InputMaybe<Array<ReservationWhereInput>>;
  NOT?: InputMaybe<Array<ReservationWhereInput>>;
  OR?: InputMaybe<Array<ReservationWhereInput>>;
  book?: InputMaybe<BookWhereInput>;
  id?: InputMaybe<IdFilter>;
  reservationDate?: InputMaybe<DateTimeNullableFilter>;
  status?: InputMaybe<StringNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
};

export type ReservationWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type Review = {
  __typename?: 'Review';
  book?: Maybe<Book>;
  comment?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  rating?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
};

export type ReviewCreateInput = {
  book?: InputMaybe<BookRelateToOneForCreateInput>;
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<UserRelateToOneForCreateInput>;
};

export type ReviewOrderByInput = {
  comment?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  rating?: InputMaybe<OrderDirection>;
};

export type ReviewUpdateArgs = {
  data: ReviewUpdateInput;
  where: ReviewWhereUniqueInput;
};

export type ReviewUpdateInput = {
  book?: InputMaybe<BookRelateToOneForUpdateInput>;
  comment?: InputMaybe<Scalars['String']['input']>;
  rating?: InputMaybe<Scalars['Int']['input']>;
  user?: InputMaybe<UserRelateToOneForUpdateInput>;
};

export type ReviewWhereInput = {
  AND?: InputMaybe<Array<ReviewWhereInput>>;
  NOT?: InputMaybe<Array<ReviewWhereInput>>;
  OR?: InputMaybe<Array<ReviewWhereInput>>;
  book?: InputMaybe<BookWhereInput>;
  comment?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  rating?: InputMaybe<IntNullableFilter>;
  user?: InputMaybe<UserWhereInput>;
};

export type ReviewWhereUniqueInput = {
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type StringFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<NestedStringFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type StringNullableFilter = {
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  equals?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  gte?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<Scalars['String']['input']>>;
  lt?: InputMaybe<Scalars['String']['input']>;
  lte?: InputMaybe<Scalars['String']['input']>;
  not?: InputMaybe<StringNullableFilter>;
  notIn?: InputMaybe<Array<Scalars['String']['input']>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  password?: Maybe<PasswordState>;
};

export type UserAuthenticationWithPasswordFailure = {
  __typename?: 'UserAuthenticationWithPasswordFailure';
  message: Scalars['String']['output'];
};

export type UserAuthenticationWithPasswordResult = UserAuthenticationWithPasswordFailure | UserAuthenticationWithPasswordSuccess;

export type UserAuthenticationWithPasswordSuccess = {
  __typename?: 'UserAuthenticationWithPasswordSuccess';
  item: User;
  sessionToken: Scalars['String']['output'];
};

export type UserCreateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserOrderByInput = {
  createdAt?: InputMaybe<OrderDirection>;
  email?: InputMaybe<OrderDirection>;
  id?: InputMaybe<OrderDirection>;
  name?: InputMaybe<OrderDirection>;
};

export type UserRelateToOneForCreateInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  create?: InputMaybe<UserCreateInput>;
};

export type UserRelateToOneForUpdateInput = {
  connect?: InputMaybe<UserWhereUniqueInput>;
  create?: InputMaybe<UserCreateInput>;
  disconnect?: InputMaybe<Scalars['Boolean']['input']>;
};

export type UserUpdateArgs = {
  data: UserUpdateInput;
  where: UserWhereUniqueInput;
};

export type UserUpdateInput = {
  createdAt?: InputMaybe<Scalars['DateTime']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserWhereInput = {
  AND?: InputMaybe<Array<UserWhereInput>>;
  NOT?: InputMaybe<Array<UserWhereInput>>;
  OR?: InputMaybe<Array<UserWhereInput>>;
  createdAt?: InputMaybe<DateTimeNullableFilter>;
  email?: InputMaybe<StringFilter>;
  id?: InputMaybe<IdFilter>;
  name?: InputMaybe<StringFilter>;
};

export type UserWhereUniqueInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
};

export type GetAuthorQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAuthorQuery = { __typename?: 'Query', authors?: Array<{ __typename?: 'Author', id: string, name?: string | null }> | null };

export type GetBookQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBookQuery = { __typename?: 'Query', books?: Array<{ __typename?: 'Book', id: string, title?: string | null }> | null };


export const GetAuthorDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAuthor"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"authors"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetAuthorQuery, GetAuthorQueryVariables>;
export const GetBookDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetBook"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"books"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GetBookQuery, GetBookQueryVariables>;