import { gql, useLazyQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHistory } from 'react-router';
import { Button } from '../../common/components/Button';
import { Card } from '../../common/components/Card';
import { Container } from '../../common/components/Container';
import { Grid, GridArea } from '../../common/components/Grid';
import { Input } from '../../common/components/Input';
import { Spacing } from '../../common/components/Spacing';
import { Label, Body, Subheading } from '../../common/components/Typography';
import { Login, LoginVariables } from '../../generated/Login';
import { Tabs } from '../frontpage/Tabs';

const LOGIN_QUERY = gql`
  query Login($username: String!, $password: String!) {
    login(name: $username, password: $password)
  }
`;

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [login, { data: result }] = useLazyQuery<Login, LoginVariables>(
    LOGIN_QUERY,
    {
      fetchPolicy: 'no-cache',
    },
  );

  const history = useHistory();

  useEffect(() => {
    if (result?.login) {
      history.push('/');
    }
  }, [result, history]);

  return (
    <Grid
      padding={30}
      width="100%"
      gridTemplateRows={'1fr'}
      gridTemplateColumns={'1fr'}
      gridAreas={['page']}
    >
      <GridArea area={'page'}>
        <Card heading={'Login'} width={'100%'} height={'100%'}>
          <Container flexDirection="column">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                login({ variables: { username, password } });
              }}
            >
              <Input
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
              <Spacing dir="y" amount={8} />
              <Input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              />
              <Spacing dir="y" amount={8} />
              <Button
                disabled={!username || !password}
                width="100%"
                type="submit"
              >
                <Body>Login</Body>
              </Button>
            </form>
          </Container>
        </Card>
      </GridArea>
    </Grid>
  );
};