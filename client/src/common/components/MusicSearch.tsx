import { gql, useQuery } from '@apollo/client';
import { h } from 'preact';
import {
  GetArtistSuggestions,
  GetArtistSuggestionsVariables,
} from '../../generated/GetArtistSuggestions';
import {
  GetTrackSuggestions,
  GetTrackSuggestionsVariables,
} from '../../generated/GetTrackSuggestions';
import { useDebounce } from '../hooks';
import { Item, Search } from './Search';

interface TrackItem extends Item {
  artist: string;
  track: string;
}

type MusicItem = Item | (Item & TrackItem);

type Props =
  | {
      type: 'artist';
      value: Item;
      onChange: (value: string) => void;
      onSelect: (value: Item) => void;
    }
  | {
      type: 'track';
      value: Item;
      onChange: (value: string) => void;
      onSelect: (value: TrackItem) => void;
    };

export const MusicSearch = ({ type, value, onChange, onSelect }: Props) => {
  const searchValue = useDebounce(500, value.label);
  const { data } = useQuery<
    GetArtistSuggestions | GetTrackSuggestions,
    GetArtistSuggestionsVariables | GetTrackSuggestionsVariables
  >(type === 'artist' ? GET_ARTIST_SUGGESTIONS : GET_TRACK_SUGGETSIONS, {
    variables:
      type === 'artist'
        ? {
            query: searchValue,
          }
        : {
            title: searchValue,
          },
  });

  const items: MusicItem[] =
    data && 'searchArtists' in data
      ? data.searchArtists.map((artist) => ({
          id: artist.id.toString(),
          label: artist.name,
        }))
      : data?.searchTracks.map((track) => ({
          id: track.id.toString(),
          track: track.title,
          artist: track.artist,
          label: `${track.title} - ${track.artist}`,
        })) ?? [];

  return (
    <Search
      items={items}
      value={value.label}
      onChange={(str) => onChange(str)}
      onSelect={(item) => onSelect(item as any)}
    ></Search>
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
