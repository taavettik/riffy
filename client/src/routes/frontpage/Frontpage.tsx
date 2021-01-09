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
import { RecentTabs } from './RecentTabs';

export const Frontpage = () => {
  return (
    <Page title="Overview" actions={<SongSearch />}>
      <Grid
        width="100%"
        gridAreas={['tabs recent']}
        gridTemplateColumns="2fr 1fr"
      >
        <GridArea area="tabs">
          <Tabs />
        </GridArea>
        <GridArea area="recent">
          <RecentTabs />
        </GridArea>
      </Grid>
    </Page>
  );
};
