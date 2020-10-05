/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrackSuggestions
// ====================================================

export interface GetTrackSuggestions_searchTracks_artist {
  __typename: "MBArtist";
  id: string;
  name: string;
}

export interface GetTrackSuggestions_searchTracks {
  __typename: "MBTrack";
  id: string;
  artist: GetTrackSuggestions_searchTracks_artist | null;
  name: string;
}

export interface GetTrackSuggestions {
  searchTracks: GetTrackSuggestions_searchTracks[];
}

export interface GetTrackSuggestionsVariables {
  query: string;
}
