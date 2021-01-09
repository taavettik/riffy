import { Grid, GridArea } from '../../common/components/Grid';
import { h } from 'preact';
import { Card } from '../../common/components/Card';
import { Container } from '../../common/components/Container';
import { Heading, Subheading } from '../../common/components/Typography';
import { Tabs } from './Tabs';
import { gql } from '@apollo/client';
import { RouteProps } from 'react-router';
import { Page } from '../../common/components/Page';
import { Input } from '../../common/components/Input';
import { SongSearch } from './SongSearch';

export const Frontpage = () => {
  return (
    <Page title="My Tabs" actions={<SongSearch />}>
      <Tabs />
    </Page>
  );
};
