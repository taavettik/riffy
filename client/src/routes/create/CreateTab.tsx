import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { useHistory, useLocation } from 'react-router';
import { Button } from '../../common/components/Button';
import { Container } from '../../common/components/Container';
import { Input, TextArea } from '../../common/components/Input';
import { Page } from '../../common/components/Page';
import { Item, Search } from '../../common/components/Search';
import { Spacing } from '../../common/components/Spacing';
import { Body, Label } from '../../common/components/Typography';
import { useDebounce } from '../../common/hooks';
import { theme } from '../../common/theme';
import { Tag } from '../../common/components/Tag';
import {
  CreateTab as ICreateTab,
  CreateTabVariables,
} from '../../generated/CreateTab';
import {
  FetchTrackInfo,
  FetchTrackInfoVariables,
} from '../../generated/FetchTrackInfo';
import {
  GetArtistSuggestions,
  GetArtistSuggestionsVariables,
} from '../../generated/GetArtistSuggestions';
import {
  GetConflictingTabs,
  GetConflictingTabsVariables,
} from '../../generated/GetConflictingTabs';
import {
  GetTrackSuggestions,
  GetTrackSuggestionsVariables,
} from '../../generated/GetTrackSuggestions';
import { Tooltip } from '../../common/components/Tooltip';

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

  const debouncedArtist = useDebounce(500, artist.label);
  const debouncedTrack = useDebounce(500, track.label);
  const { data: artists } = useQuery<
    GetArtistSuggestions,
    GetArtistSuggestionsVariables
  >(GET_ARTIST_SUGGESTIONS, {
    variables: {
      query: debouncedArtist,
    },
    fetchPolicy: 'no-cache',
  });
  const { data: tracks } = useQuery<
    GetTrackSuggestions,
    GetTrackSuggestionsVariables
  >(GET_TRACK_SUGGETSIONS, {
    variables: {
      title: debouncedTrack,
    },
    fetchPolicy: 'no-cache',
  });

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

  const trackItems =
    tracks?.searchTracks.map((track) => ({
      id: track.id.toString(),
      track: track.title,
      artist: track.artist,
      label: `${track.title} - ${track.artist}`,
    })) ?? [];

  return (
    <Page title="Create tab" showBackButton>
      <Container width="100%" height="100%" flexDirection="row">
        <Container maxWidth="300px" width="100%" flexDirection="column">
          <Container width="100%" flexDirection="column" height="100%">
            <Body>Title</Body>

            <Spacing dir="y" amount={4} />

            <Search
              items={trackItems}
              onChange={(value) =>
                value !== track.label && setTrack({ id: '', label: value })
              }
              onSelect={(item) => {
                setTrack({ id: item.id, label: item.track });
                setArtist({ id: '', label: item.artist });
              }}
              value={track.label}
            />

            <Spacing dir="y" amount={8} />

            <Body>Artist</Body>

            <Search
              items={
                artists?.searchArtists.map((artist) => ({
                  id: artist.id.toString(),
                  label: artist.name,
                })) ?? []
              }
              onSelect={(item) => setArtist(item)}
              onChange={(value) =>
                value !== artist.label && setArtist({ id: '', label: value })
              }
              value={artist.label}
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
            width="100%"
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

const GET_ARTIST_SUGGESTIONS = gql`
  query GetArtistSuggestions($query: String!) {
    searchArtists(query: $query) {
      id
      name
    }
  }
`;

const GET_TRACK_SUGGETSIONS = gql`
  query GetTrackSuggestions($title: String!, $artist: String) {
    searchTracks(title: $title, artist: $artist) {
      id
      artist
      title
    }
  }
`;

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

const GET_CONFLICTING_TABS = gql`
  query GetConflictingTabs($title: String!, $artist: String!) {
    getConflictingTabs(title: $title, artist: $artist) {
      id
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
