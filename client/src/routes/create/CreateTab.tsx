import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHistory, useLocation } from 'react-router';
import { Button } from '../../common/components/Button';
import { Container } from '../../common/components/Container';
import { TextArea } from '../../common/components/Input';
import { Page } from '../../common/components/Page';
import { Item } from '../../common/components/Search';
import { Spacing } from '../../common/components/Spacing';
import { Body } from '../../common/components/Typography';
import { theme } from '../../common/theme';
import {
  CreateTab as ICreateTab,
  CreateTabVariables,
} from '../../generated/CreateTab';
import {
  FetchTrackInfo,
  FetchTrackInfoVariables,
} from '../../generated/FetchTrackInfo';
import {
  GetConflictingTabs,
  GetConflictingTabsVariables,
} from '../../generated/GetConflictingTabs';
import { MusicSearch } from '../../common/components/MusicSearch';
import { GET_CONFLICTING_TABS } from '../../common/queries';

export const CreateTab = () => {
  const loc = useLocation<{
    chords?: string;
    trackArtist?: string;
    trackTitle?: string;
  }>();

  const [artist, setArtist] = useState<Item>({ id: '', label: '' });
  const [track, setTrack] = useState<Item>({ id: '', label: '' });
  const [chords, setChords] = useState('');

  useEffect(() => {
    setArtist({ id: '', label: loc.state.trackArtist || '' });
    setTrack({ id: '', label: loc.state.trackTitle || '' });
    setChords(loc.state.chords || '');
  }, [loc?.state]);

  const [fetchTrackInfo, { data: trackInfo }] = useLazyQuery<
    FetchTrackInfo,
    FetchTrackInfoVariables
  >(FETCH_TRACK_INFO, {
    variables: {
      id: Number(track.id),
    },
  });

  useEffect(() => {
    if (!track.id || Number.isNaN(Number(track.id))) {
      return;
    }
    fetchTrackInfo();
  }, [track.id]);

  useEffect(() => {
    if (!trackInfo) {
      return;
    }
    if (artist.label === trackInfo.fetchTrackInfo.artist) {
      return;
    }
    setTrack((track) => ({ id: '', label: track.label }));
  }, [artist.label, trackInfo]);

  const { data: conflicts } = useQuery<
    GetConflictingTabs,
    GetConflictingTabsVariables
  >(GET_CONFLICTING_TABS, {
    variables: {
      title: track.label,
      artist: artist.label,
    },
  });

  const history = useHistory();

  const [create] = useMutation<ICreateTab, CreateTabVariables>(CREATE_TAB, {
    onCompleted: (data) => {
      history.push('/', {
        selected: data.createTab.artist
          ? {
              id: data.createTab.artist.id,
              name: data.createTab.artist.name,
            }
          : undefined,
      });
    },
    refetchQueries: ['GetTabs'],
  });

  const onCreate = () => {
    create({
      variables: {
        title: track.label,
        artist: artist.label,
        chords: chords,
      },
    });
  };

  return (
    <Page title="Create tab" showBackButton>
      <Container width="100%" height="100%" flexDirection="row">
        <Container maxWidth="300px" width="100%" flexDirection="column">
          <Container width="100%" flexDirection="column" height="100%">
            <Body>Title</Body>

            <Spacing dir="y" amount={4} />

            <MusicSearch
              type="track"
              value={track}
              onChange={(track) => setTrack({ id: '', label: track })}
              onSelect={(item) => {
                setTrack({
                  id: item.id,
                  label: item.track,
                });
                setArtist({
                  id: '',
                  label: artist.label || item.artist,
                });
              }}
            />

            <Spacing dir="y" amount={8} />

            <Body>Artist</Body>

            <MusicSearch
              type="artist"
              value={artist}
              onChange={(artist) => setArtist({ id: '', label: artist })}
              onSelect={(item) => setArtist(item)}
            />

            <Spacing dir="y" amount={8} />

            {(conflicts?.getConflictingTabs.length ?? 0) > 0 && (
              <Body color={theme.colors.error.main}>
                A tab with this name already exists. The contents will be
                overwritten.
              </Body>
            )}
          </Container>
          <Container width="100%">
            <Button onClick={() => onCreate()} width="100%">
              <Body>Create</Body>
            </Button>
          </Container>
        </Container>
        <Spacing dir="x" amount={16} />
        <Container width="100%" flexDirection="column">
          <Body>Chords</Body>
          <Spacing dir="y" amount={4} />
          <TextArea
            spellCheck={'false'}
            height="100%"
            resize="none"
            onChange={(e) => setChords(e.target.value)}
          >
            {chords}
          </TextArea>
        </Container>
      </Container>
    </Page>
  );
};

const FETCH_TRACK_INFO = gql`
  query FetchTrackInfo($id: Float!) {
    fetchTrackInfo(id: $id) {
      id
      artist
      title
      isrc
    }
  }
`;

const CREATE_TAB = gql`
  mutation CreateTab($title: String!, $chords: String!, $artist: String!) {
    createTab(title: $title, chords: $chords, artist: $artist) {
      id
      artist {
        id
        name
        tabs {
          id
          trackTitle
        }
      }
      chords
    }
  }
`;
