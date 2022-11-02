import { FunctionalComponent, h } from 'preact';
import {
  Router,
  Switch,
  BrowserRouter,
  Route,
  RouteProps,
  useHistory,
} from 'react-router-dom';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { theme } from './common/theme';
import { Frontpage } from './routes/frontpage/Frontpage';
import { LeftDock } from './common/navigation/LeftDock';
import { Container } from './common/components/Container';
import { ApolloClient } from '@apollo/client/core/ApolloClient';
import { ApolloProvider, gql, InMemoryCache, useQuery } from '@apollo/client';
import { config } from './common/config';
import { useEffect } from 'preact/hooks';
import { LoginPage } from './routes/login/Login';
import { CurrentAccount } from './generated/CurrentAccount';
import { CreateTab } from './routes/create/CreateTab';
import { Tab } from './routes/tab/Tab';
import { EditTab } from './routes/edit/EditTab';
import { Ug } from './routes/ug/Ug';
import { Upload } from './routes/upload/Upload';
import { TabContext } from './common/components/TabNav';

const client = new ApolloClient({
  uri: config.API_URL,
  cache: new InMemoryCache(),
});

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-size: ${(props) => props.theme.typography.body.fontSize as any}px;
    background-color: ${(props) => props.theme.colors.gray.lighter};

    ${(props) => props.theme.mobile} {
      background-color: white;
    }
  }

  #app {
    display: flex;
    justify-content: center;
    padding: 32px 32px 0 32px;

    ${(props) => props.theme.mobile} {
      padding: 0;
    }
  }

  * {
    font-family: 'Noto Sans', sans-serif;
  }
`;

const CURRENT_ACCOUNT = gql`
  query CurrentAccount {
    currentAccount {
      id
    }
  }
`;

const ProtectedRoute = (props: RouteProps) => {
  const { data: currentAccount, loading } = useQuery<CurrentAccount>(
    CURRENT_ACCOUNT,
  );
  const history = useHistory();

  useEffect(() => {
    if (!currentAccount && !loading) {
      history.replace('/login');
    }
  }, [currentAccount, loading]);

  return <Route {...props}></Route>;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <GlobalStyle />

        <TabContext.Provider value={{}}>
          <Card>
            <BrowserRouter>
              <Switch>
                <Route path="/login">
                  <LoginPage />
                </Route>
                <ProtectedRoute path="/tab/:id">
                  <Tab />
                </ProtectedRoute>
                <ProtectedRoute path="/edit/:id">
                  <EditTab />
                </ProtectedRoute>
                <ProtectedRoute path="/create">
                  <CreateTab />
                </ProtectedRoute>
                <ProtectedRoute path="/upload">
                  <Upload />
                </ProtectedRoute>
                <ProtectedRoute path="/ug/:url">
                  <Ug />
                </ProtectedRoute>
                <ProtectedRoute path="/">
                  <Frontpage />
                </ProtectedRoute>
              </Switch>
            </BrowserRouter>
          </Card>
        </TabContext.Provider>
      </ApolloProvider>
    </ThemeProvider>
  );
};

const Card = styled.div`
  width: 100%;
  max-width: 1600px;
  height: 100%;
  padding: 32px;
  border: 1px solid ${(props) => props.theme.colors.gray.main};
  background-color: white;
  box-shadow: 1px 1px ${(props) => props.theme.colors.gray.light};
  border-radius: ${(props) => props.theme.borderRadius};

  ${(props) => props.theme.mobile} {
    border: none;
  }
`;

export default App;
