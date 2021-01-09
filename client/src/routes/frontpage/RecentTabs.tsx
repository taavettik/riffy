import { gql, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect } from 'preact/hooks';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
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
        const label = [tab.trackArtist, tab.trackTitle]
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
        trackArtist
        id
      }
    }
  }
`;

const TabLink = styled(Link)`
  color: black;
  min-height: 40px;
  display: flex;
  width: 100%;
  text-decoration: none;
  border-bottom: 1px solid black;
  vertical-align: middle;
  align-items: center;

  :hover {
    color: ${(p) => p.theme.colors.primary.darkest};
    border-color: ${(p) => p.theme.colors.primary.darkest};
  }
`;
