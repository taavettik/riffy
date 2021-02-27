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
