import { gql } from '@apollo/client';

export const GET_TAB = gql`
  query GetTab($id: String!) {
    getTab(id: $id) {
      id
      chords
      trackTitle
      artist {
        name
      }
      transposition
      isFavourite
    }
  }
`;

export const GET_UG_TAB = gql`
  query GetUgTab($url: String!) {
    getUgTab(url: $url) {
      id
      trackTitle
      trackArtist
      chords
      transposition
      isFavourite
    }
  }
`;

export const GET_CONFLICTING_TABS = gql`
  query GetConflictingTabs($title: String!, $artist: String!) {
    getConflictingTabs(title: $title, artist: $artist) {
      id
    }
  }
`;
