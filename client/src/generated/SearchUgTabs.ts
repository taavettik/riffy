/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchUgTabs
// ====================================================

export interface SearchUgTabs_searchUgTabs {
  __typename: "UgSearchResult";
  trackTitle: string;
  trackArtist: string;
  url: string;
  votes: number;
  version: number;
}

export interface SearchUgTabs {
  searchUgTabs: SearchUgTabs_searchUgTabs[];
}

export interface SearchUgTabsVariables {
  query: string;
}
