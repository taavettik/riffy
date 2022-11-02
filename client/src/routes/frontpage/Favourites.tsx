import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { h } from 'preact';
import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
import { TabLinks } from '../../common/components/TabLinks';
import { FavouriteTabs } from '../../generated/FavouriteTabs';
import { Body } from '../../common/components/Typography';

export const Favourites = () => {
  const { data } = useQuery<FavouriteTabs>(FAVOURITE_TABS, {
    fetchPolicy: 'cache-and-network',
  });

  const tabs = data?.favouriteTabs ?? [];

  return (
    <Container flexDirection="column" width="100%" overflowY="auto">
      <Spacing dir="y" amount={32} />

      {tabs.length === 0 && (
        <Container>
          <Spacing dir="x" amount={64} />

          <Body>No favourite tabs yet!</Body>
        </Container>
      )}

      <TabLinks tabs={tabs} />
    </Container>
  );
};

export const FAVOURITE_TABS = gql`
  query FavouriteTabs {
    favouriteTabs {
      ... on ExternalTab {
        url
        trackTitle
        trackArtist
        isFavourite
      }
      ... on Tab {
        id
        trackTitle
        artist {
          id
          name
        }
        isFavourite
      }
    }
  }
`;
