/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTabs
// ====================================================

export interface GetTabs_getArtist_tabs {
  __typename: "Tab";
  id: string;
  trackTitle: string;
}

export interface GetTabs_getArtist {
  __typename: "Artist";
  id: string;
  name: string;
  tabs: GetTabs_getArtist_tabs[];
}

export interface GetTabs {
  getArtist: GetTabs_getArtist | null;
}

export interface GetTabsVariables {
  artistId: string;
}
