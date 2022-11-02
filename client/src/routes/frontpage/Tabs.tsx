import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { h } from 'preact';
import { Link, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
import { Body, Heading, Subheading } from '../../common/components/Typography';
import { GetTabs, GetTabsVariables } from '../../generated/GetTabs';
import { useEffect, useState } from 'preact/hooks';
import { AddIcon, BackIcon } from '../../common/icons';
import { TabLink } from '../../common/components/TabLink';
import { GetArtists } from '../../generated/GetArtists';
import { DropZone } from '../../common/components/DropZone';
import { CreateArtistModal } from '../../common/components/modals/CreateArtistModal';
import { IconButton } from '../../common/components/IconButton';
import { TabLinks } from '../../common/components/TabLinks';

export const Tabs = () => {
  const { data, refetch } = useQuery<GetArtists>(GET_ARTISTS);
  const [getTabs, { data: tabData }] = useLazyQuery<GetTabs, GetTabsVariables>(
    GET_TABS,
  );

  const { state, pathname } = useLocation<{
    selected: { id: string; name: string } | null;
  }>();

  const [selected, setSelected] = useState<null | { id: string; name: string }>(
    state?.selected ?? null,
  );

  const [createArtistModal, toggleCreateArtistModal] = useState(false);
  const [files, setFiles] = useState<
    { chords: string; trackArtist: string; trackTitle: string }[]
  >([]);

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
      width="100%"
      onDrop={(files) => {
        const parsedFiles = files.map((file) => {
          const nameParts = file.name.split('.');
          const filename =
            nameParts.length === 1
              ? nameParts[0]
              : nameParts.slice(0, -1).join('.');
          const parts = filename.split(/\s*-\s*/g);
          const artist = parts.length === 1 ? selected?.name : parts[0];
          const title = parts.slice(-1)[0];

          return {
            chords: file.content,
            trackArtist: artist ?? '',
            trackTitle: title,
          };
        });

        setFiles(parsedFiles);

        const artistsSet = parsedFiles.every((file) => file.trackArtist);

        if (!artistsSet) {
          toggleCreateArtistModal(true);
          return;
        }

        history.push('/upload', {
          tabs: parsedFiles,
        });
      }}
    >
      <Container
        maxWidth={800}
        width={'100%'}
        height="100%"
        flexDirection="column"
      >
        <Spacing dir="y" amount={16} />

        <Container alignItems="center">
          {showTabs && (
            <>
              <IconButton
                onClick={() => {
                  setSelected(null);
                  history.replace({
                    pathname,
                    state: {
                      selected: null,
                    },
                  });
                }}
                icon={BackIcon}
                size={32}
              />

              <Spacing dir="x" amount={8} />

              <Subheading width="auto">{selected?.name}</Subheading>
            </>
          )}
        </Container>

        <Spacing dir="y" amount={16} />

        <Container flexDirection="column">
          {showTabs ? (
            <>
              <TabLink
                as="button"
                onClick={() => {
                  setSelected(null);
                  history.replace({
                    pathname,
                    state: {
                      selected: null,
                    },
                  });
                }}
              >
                ..
              </TabLink>

              {tabData?.getArtist && (
                <TabLinks tabs={tabData?.getArtist?.tabs} />
              )}
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
      </Container>

      <CreateArtistModal
        open={createArtistModal}
        onClose={() => toggleCreateArtistModal(false)}
        onContinue={(artist) =>
          history.push('/upload', {
            tabs: files.map((file) => ({
              ...file,
              trackArtist: file.trackArtist || artist,
            })),
          })
        }
      />
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
        isFavourite
      }
    }
  }
`;

const TabRow = styled(Container)`
  border-bottom: 1px solid black;
  width: 100%;
  flex-wrap: wrap;
`;
