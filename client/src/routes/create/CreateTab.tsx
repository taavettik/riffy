import { gql, useQuery } from '@apollo/client';
import { h } from 'preact';
import { useEffect, useState } from 'preact/hooks';
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

  return (
    <Page title="Create tab">
      <Container width="100%" height="100%" flexDirection="row">
        <Container maxWidth="300px" width="100%" flexDirection="column">
          <Body>Artist</Body>
          <Spacing dir="y" amount={4} />
          <Search
            items={artists?.searchArtists ?? []}
            onChange={(value) => setArtist(value)}
            onSelect={(value) => setArtist(value)}
            value={artist}
          />
          <Spacing dir="y" amount={8} />
          <Body>Title</Body>
          <Spacing dir="y" amount={4} />
          <Search
            items={
              tracks?.searchTracks.map(
                (track) => `${track.name} - ${track.artist}`,
              ) ?? []
            }
            onChange={(value) => setTrack(value)}
            onSelect={(value) => setTrack(value)}
            value={track}
          />
        </Container>
        <Spacing dir="x" amount={16} />
        <Container width="100%" flexDirection="column">
          <Body>Chords</Body>
          <Spacing dir="y" amount={4} />
          <TextArea width="100%" height="100%" resize="none"></TextArea>
        </Container>
      </Container>
    </Page>
  );
};
