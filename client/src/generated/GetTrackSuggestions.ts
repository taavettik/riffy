/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrackSuggestions
// ====================================================

export interface GetTrackSuggestions_searchTracks {
  __typename: "Track";
  id: string;
  artist: string | null;
  name: string;
}

export interface GetTrackSuggestions {
  searchTracks: GetTrackSuggestions_searchTracks[];
}

export interface GetTrackSuggestionsVariables {
  query: string;
}
