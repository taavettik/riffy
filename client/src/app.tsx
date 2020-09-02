import { FunctionalComponent, h } from 'preact';
import { Router, Switch, BrowserRouter, Route } from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from './common/theme';
import { Frontpage } from './routes/frontpage/Frontpage';
import { LeftDock } from './common/navigation/LeftDock';
import { Container } from './common/components/Container';
import { ApolloClient } from '@apollo/client/core/ApolloClient';
import { ApolloProvider, gql, InMemoryCache } from '@apollo/client';
import { config } from './common/config';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((module as any).hot) {
  require('preact/debug');
}

const client = new ApolloClient({
  uri: config.API_URL,
  cache: new InMemoryCache(),
});

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-size: ${props => props.theme.typography.body.fontSize}px;
    background-color: ${props => props.theme.colors.gray.lighter};
    font-family: 'Noto Sans', sans-serif;
  }
`;

const App = () => {
  return (
    <Page id="app">
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <GlobalStyle />
          <Container margin="0 auto" maxWidth={1200} width={'100%'}>
            <BrowserRouter>
              <Switch>
                <Route path="/" default>
                  <Frontpage />
                </Route>
              </Switch>
            </BrowserRouter>
          </Container>
        </ApolloProvider>
      </ThemeProvider>
    </Page>
  );
};

const Page = styled.div`
  width: 100%;
  height: 90%;
  position: absolute;
  display: flex;
`;

export default App;
