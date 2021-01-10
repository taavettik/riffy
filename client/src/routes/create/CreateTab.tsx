import { gql, useMutation, useQuery } from '@apollo/client';
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
import {
  CreateTab as ICreateTab,
  CreateTabVariables,
} from '../../generated/CreateTab';
import {
  GetArtistSuggestions,
  GetArtistSuggestionsVariables,
} from '../../generated/GetArtistSuggestions';
import {
  GetTrackSuggestions,
  GetTrackSuggestionsVariables,
} from '../../generated/GetTrackSuggestions';

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
  }, [loc.state]);

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
      query: debouncedTrack,
    },
    fetchPolicy: 'no-cache',
  });

  const history = useHistory();

  const [create] = useMutation<ICreateTab, CreateTabVariables>(CREATE_TAB, {
    onCompleted: () => history.push('/'),
    refetchQueries: ['GetTabs'],
  });

  const onCreate = () => {
    create({
      variables: {
        title: track.label,
        artist: artist.label,
        chords: chords,
        trackId: track.id || undefined,
        artistId: artist.id || undefined,
      },
    });
  };

  const trackItems =
    tracks?.searchTracks.map((track) => ({
      id: track.id,
      track: track.name,
      artist: track.artist,
      label: `${track.name} - ${track.artist?.name}`,
    })) ?? [];

  return (
    <Page title="Create tab" showBackButton>
      <Container width="100%" height="100%" flexDirection="row">
        <Container maxWidth="300px" width="100%" flexDirection="column">
          <Container width="100%" flexDirection="column" height="100%">
            <Body>Artist</Body>
            <Spacing dir="y" amount={4} />
            <Search
              items={
                artists?.searchArtists.map((artist) => ({
                  id: artist.id,
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
            <Body>Title</Body>
            <Spacing dir="y" amount={4} />
            <Search
              items={trackItems}
              onChange={(value) =>
                value !== track.label && setTrack({ id: '', label: value })
              }
              onSelect={(item) => {
                setTrack({ id: item.id, label: item.track });
                if (item.artist) {
                  setArtist({ id: item.artist.id, label: item.artist.name });
                }
              }}
              value={track.label}
            />
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
  query GetTrackSuggestions($query: String!) {
    searchTracks(query: $query) {
      id
      artist {
        id
        name
      }
      name
    }
  }
`;

const CREATE_TAB = gql`
  mutation CreateTab(
    $title: String!
    $chords: String!
    $artist: String!
    $trackId: String
    $artistId: String
  ) {
    createTab(
      title: $title
      chords: $chords
      artist: $artist
      mbId: $trackId
      mbArtistId: $artistId
    ) {
      id
    }
  }
`;
