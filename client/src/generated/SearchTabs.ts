/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: SearchTabs
// ====================================================

export interface SearchTabs_searchTabs_artist {
  __typename: "Artist";
  id: string;
  name: string;
}

export interface SearchTabs_searchTabs {
  __typename: "Tab";
  id: string;
  trackTitle: string;
  artist: SearchTabs_searchTabs_artist | null;
}

export interface SearchTabs {
  searchTabs: SearchTabs_searchTabs[];
}

export interface SearchTabsVariables {
  query: string;
}
