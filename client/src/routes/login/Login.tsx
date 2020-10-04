import { gql } from '@apollo/client';
import { h } from 'preact';
import { Button } from '../../common/components/Button';
import { Card } from '../../common/components/Card';
import { Container } from '../../common/components/Container';
import { Grid, GridArea } from '../../common/components/Grid';
import { Input } from '../../common/components/Input';
import { Spacing } from '../../common/components/Spacing';
import { Label, Body, Subheading } from '../../common/components/Typography';
import { Tabs } from '../frontpage/Tabs';

const LOGIN_QUERY = gql`
  query Login($name: String!, $password: String!) {
    login(name: $username, password: $password)
  }
`;

export const LoginPage = () => {
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
            <form>
              <Input placeholder="Username" />
              <Spacing dir="y" amount={8} />
              <Input type="password" placeholder="Password" />
              <Spacing dir="y" amount={8} />
              <Button width="100%" type="submit">
                <Body>Login</Body>
              </Button>
            </form>
          </Container>
        </Card>
      </GridArea>
    </Grid>
  );
};
