import { gql } from '@apollo/client';
import { h } from 'preact';
import { Card } from '../../common/components/Card';
import { Container } from '../../common/components/Container';
import { Grid, GridArea } from '../../common/components/Grid';
import { Input } from '../../common/components/Input';
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
          <Input />
        </Card>
      </GridArea>
    </Grid>
  );
};
