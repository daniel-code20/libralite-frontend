import { NextUIProvider } from '@nextui-org/react';
import { ApolloClient, InMemoryCache, ApolloProvider, ApolloLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import ReactDOM from 'react-dom/client';
import './styles.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import React from 'react';
import { UserProvider } from '../src/provider/userProvider';

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  const csrfToken = localStorage.getItem('csrfToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
      'x-csrf-token': csrfToken || '',
    },
  };
});

const uploadLink = createUploadLink({
  uri: 'http://localhost:3000/api/graphql',
});

const client = new ApolloClient({
  link: ApolloLink.from([authLink, uploadLink]),
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById('root') as Element);

root.render(
  <UserProvider>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </BrowserRouter>
    </ApolloProvider>
  </UserProvider>
);

export default client;