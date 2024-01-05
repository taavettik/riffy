import { gql, useLazyQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHistory } from 'react-router';
import { Button } from '../../common/components/Button';
import { Card } from '../../common/components/Card';
import { Container } from '../../common/components/Container';
import { Grid, GridArea } from '../../common/components/Grid';
import { Input } from '../../common/components/Input';
import { Page } from '../../common/components/Page';
import { Spacing } from '../../common/components/Spacing';
import { Label, Body, Subheading } from '../../common/components/Typography';
import { Login, LoginVariables } from '../../generated/Login';
import { Tabs } from '../frontpage/Tabs';
import { useTheme } from 'styled-components';

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(name: $username, password: $password)
  }
`;

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const theme = useTheme();

  const [login, { data: result, loading }] = useLazyQuery<
    Login,
    LoginVariables
  >(LOGIN_QUERY, {
    fetchPolicy: 'no-cache',
    onCompleted: (data) => {
      if (data.login) {
        history.push('/');
      }
    },
  });

  return (
    <Page title="Login">
      <Grid
        padding={30}
        width="100%"
        gridTemplateRows={'1fr'}
        gridTemplateColumns={'1fr'}
        gridAreas={['page']}
      >
        <GridArea area={'page'}>
          <Container flexDirection="column">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login({ variables: { username, password } });
              }}
            >
              <Input
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="Username"
              />
              <Spacing dir="y" amount={8} />
              <Input
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                type="password"
                placeholder="Password"
              />
              <Spacing dir="y" amount={8} />
              <Button
                disabled={!username || !password || loading}
                type="submit"
              >
                <Body>Login</Body>
              </Button>
            </form>

            <Spacing dir="y" amount={16} />

            {result && !result.login && (
              <Body color={theme.colors.error.main}>
                Incorrect username or password
              </Body>
            )}
          </Container>
        </GridArea>
      </Grid>
    </Page>
  );
};
