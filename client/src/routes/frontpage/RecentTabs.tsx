import { gql, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
import { TabLink } from '../../common/components/TabLink';
import { Subheading } from '../../common/components/Typography';
import { UgIcon } from '../../common/components/UgIcon';
import { GetRecentTabs } from '../../generated/GetRecentTabs';

export const RecentTabs = () => {
  const { data, refetch } = useQuery<GetRecentTabs>(RECENT_TABS);

  useEffect(() => {
    refetch();
  }, []);

  if (!data) {
    return <div></div>;
  }

  return (
    <Container flexDirection="column">
      <Subheading>Recently viewed</Subheading>

      <Spacing dir="y" amount={16} />

      {data.recentTabs.map((tab, i) => {
        const label = [
          'trackArtist' in tab ? tab.trackArtist : tab.artist?.name,
          tab.trackTitle,
        ]
          .filter(Boolean)
          .join(' - ');

        if (tab.__typename === 'Tab') {
          return (
            <TabLink key={i} to={`/tab/${tab.id}`}>
              {label}
            </TabLink>
          );
        }
        return (
          <TabLink key={i} to={`/ug/${encodeURIComponent(tab.url)}`}>
            {label} <Spacing dir="x" amount={8} /> <UgIcon />
          </TabLink>
        );
      })}
    </Container>
  );
};

const RECENT_TABS = gql`
  query GetRecentTabs {
    recentTabs {
      __typename
      ... on ExternalTab {
        trackTitle
        trackArtist
        url
      }
      ... on Tab {
        trackTitle
        artist {
          name
        }
        id
      }
    }
  }
`;
