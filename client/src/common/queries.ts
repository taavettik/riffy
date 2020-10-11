import { gql } from '@apollo/client';

export const GET_TAB = gql`
  query GetTab($id: String!) {
    getTab(id: $id) {
      id
      chords
      trackTitle
      trackArtist
    }
  }
`;
