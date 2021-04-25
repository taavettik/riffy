import { GridArea } from '../../common/components/Grid';
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
import styled from 'styled-components';

export const Frontpage = () => {
  return (
    <Page title="Overview" actions={<SongSearch />}>
      <Grid>
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

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-areas: 'tabs recent';
  grid-template-columns: 2fr 1fr;
  grid-gap: 32px;

  ${(props) => props.theme.mobile} {
    grid-template-areas: 'tabs' 'recent';
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;
