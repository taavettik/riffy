import { gql, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Button } from '../../common/components/Button';
import { Container } from '../../common/components/Container';
import { Input, TextArea } from '../../common/components/Input';
import { Page } from '../../common/components/Page';
import { Search } from '../../common/components/Search';
import { Spacing } from '../../common/components/Spacing';
import { Body, Label } from '../../common/components/Typography';
import { useDebounce } from '../../common/hooks';
import {
  GetArtistSuggestions,
  GetArtistSuggestionsVariables,
} from '../../generated/GetArtistSuggestions';
import {
  GetTrackSuggestions,
  GetTrackSuggestionsVariables,
} from '../../generated/GetTrackSuggestions';

const GET_ARTIST_SUGGESTIONS = gql`
  query GetArtistSuggestions($query: String!) {
    searchArtists(query: $query)
  }
`;

const GET_TRACK_SUGGETSIONS = gql`
  query GetTrackSuggestions($query: String!) {
    searchTracks(query: $query) {
      artist
      name
    }
  }
`;

export const CreateTab = () => {
  const [artist, setArtist] = useState('');
  const [track, setTrack] = useState('');

  const debouncedArtist = useDebounce(500, artist);
  const debouncedTrack = useDebounce(500, track);
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

  const trackItems =
    tracks?.searchTracks.map((track) => ({
      id: track.name,
      track: track.name,
      artist: track.artist,
      label: `${track.name} - ${track.artist}`,
    })) ?? [];

  const onTrackChange = (value: string) => {
    setTrack(value);
  };

  return (
    <Page title="Create tab">
      <Container width="100%" height="100%" flexDirection="row">
        <Container maxWidth="300px" width="100%" flexDirection="column">
          <Container width="100%" flexDirection="column" height="100%">
            <Body>Artist</Body>
            <Spacing dir="y" amount={4} />
            <Search
              items={
                artists?.searchArtists.map((artist) => ({
                  id: artist,
                  label: artist,
                })) ?? []
              }
              onChange={(value) => setArtist(value)}
              value={artist}
            />
            <Spacing dir="y" amount={8} />
            <Body>Title</Body>
            <Spacing dir="y" amount={4} />
            <Search
              items={trackItems}
              onChange={(value) => setTrack(value)}
              onSelect={(item) => {
                setTrack(item.track);
                if (item.artist) {
                  setArtist(item.artist);
                }
              }}
              value={track}
            />
          </Container>
          <Container width="100%">
            <Button width="100%">
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
          ></TextArea>
        </Container>
      </Container>
    </Page>
  );
};
