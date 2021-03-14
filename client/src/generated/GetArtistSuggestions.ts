/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetArtistSuggestions
// ====================================================

export interface GetArtistSuggestions_searchArtists {
  __typename: "MBArtist";
  id: string;
  name: string;
}

export interface GetArtistSuggestions {
  searchArtists: GetArtistSuggestions_searchArtists[];
}

export interface GetArtistSuggestionsVariables {
  query: string;
}
