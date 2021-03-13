/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTrackSuggestions
// ====================================================

export interface GetTrackSuggestions_searchTracks {
  __typename: "TrackSearchResult";
  id: number;
  artist: string;
  title: string;
}

export interface GetTrackSuggestions {
  searchTracks: GetTrackSuggestions_searchTracks[];
}

export interface GetTrackSuggestionsVariables {
  title: string;
  artist?: string | null;
}
