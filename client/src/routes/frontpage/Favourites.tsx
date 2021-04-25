import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { h } from 'preact';
import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
import { TabLinks } from '../../common/components/TabLinks';
import { FavouriteTabs } from '../../generated/FavouriteTabs';

export const Favourites = () => {
  const { data } = useQuery<FavouriteTabs>(FAVOURITE_TABS);

  const tabs = data?.favouriteTabs ?? [];

  return (
    <Container flexDirection="column" width="100%">
      <Spacing dir="y" amount={32} />

      <TabLinks tabs={tabs} />
    </Container>
  );
};

const FAVOURITE_TABS = gql`
  query FavouriteTabs {
    favouriteTabs {
      ... on ExternalTab {
        url
        trackTitle
        trackArtist
      }
      ... on Tab {
        id
        trackTitle
        artist {
          id
          name
        }
      }
    }
  }
`;
