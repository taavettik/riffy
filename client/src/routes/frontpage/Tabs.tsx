import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { h } from 'preact';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
import { Body, Heading, Subheading } from '../../common/components/Typography';
import { GetTabs, GetTabsVariables } from '../../generated/GetTabs';
import { useEffect, useState } from 'preact/hooks';
import { AddIcon } from '../../common/icons';
import { TabLink } from '../../common/components/TabLink';
import { GetArtists } from '../../generated/GetArtists';
import { DropZone } from '../../common/components/DropZone';

export const Tabs = () => {
  const { data, refetch } = useQuery<GetArtists>(GET_ARTISTS);
  const [getTabs, { data: tabData, loading: tabDataLoading }] = useLazyQuery<
    GetTabs,
    GetTabsVariables
  >(GET_TABS);

  const { state, pathname } = useLocation<{
    selected: { id: string; name: string } | null;
  }>();

  const [selected, setSelected] = useState<null | { id: string; name: string }>(
    state?.selected ?? null,
  );

  const history = useHistory();

  useEffect(() => {
    if (!selected) {
      return;
    }
    getTabs({
      variables: {
        artistId: selected.id,
      },
    });
  }, [selected?.id]);

  useEffect(() => {
    refetch();
  }, []);

  const showTabs = selected && tabData?.getArtist?.id === selected.id;

  return (
    <DropZone
      onDrop={(files) => {
        // TODO: support for bulk uploading
        const [file] = files;

        const nameParts = file.name.split('.');
        const filename =
          nameParts.length === 1
            ? nameParts[0]
            : nameParts.slice(0, -1).join('.');
        const parts = filename.split(/\s*-\s*/g);
        const artist = parts.length === 1 ? selected?.name : parts[0];
        const title = parts.slice(-1)[0];

        history.push('/create', {
          chords: file.content,
          trackArtist: artist,
          trackTitle: title,
        });
      }}
    >
      <Container maxWidth={800} width={'100%'} flexDirection="column">
        <Subheading>{showTabs ? selected?.name : 'My Artists'}</Subheading>

        <Spacing dir="y" amount={16} />

        {showTabs ? (
          <>
            <TabLink as="button" onClick={() => setSelected(null)}>
              ..
            </TabLink>
            {tabData?.getArtist?.tabs.map((tab) => (
              <TabLink key={tab.id} to={`/tab/${tab.id}`}>
                {tab.trackTitle}
              </TabLink>
            ))}
          </>
        ) : (
          data?.getArtists.map((artist) => (
            <TabLink
              key={artist.id}
              as="button"
              onClick={() => {
                const selected = {
                  id: artist.id,
                  name: artist.name,
                };
                setSelected(selected);
                history.replace({
                  pathname,
                  state: {
                    selected,
                  },
                });
              }}
            >
              {artist.name}
            </TabLink>
          ))
        )}

        <TabLink
          to={{
            pathname: '/create',
            state: {
              trackArtist: selected ? selected.name : undefined,
            },
          }}
        >
          <AddIcon size={32} />
          <Spacing dir="x" amount={16} />
          <Body>Create tab</Body>
        </TabLink>
      </Container>
    </DropZone>
  );
};

const GET_ARTISTS = gql`
  query GetArtists {
    getArtists {
      id
      name
    }
  }
`;

const GET_TABS = gql`
  query GetTabs($artistId: String!) {
    getArtist(id: $artistId) {
      id
      name
      tabs {
        id
        trackTitle
      }
    }
  }
`;

const Row = styled(Container)`
  border-bottom: 1px solid black;
  width: 100%;
  flex-wrap: wrap;
`;

const TableLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-direction: row;
  text-decoration: none;
  color: black;
  min-height: 40px;
  min-width: 200px;
  display: flex;
  padding-left: 4px;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary.lightest};
  }
  flex: 1;
`;

const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;

  td {
    border-bottom: 1px solid black;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }

  tr {
  }
`;
