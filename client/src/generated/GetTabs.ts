/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTabs
// ====================================================

export interface GetTabs_getTabs_artist {
  __typename: "Artist";
  name: string;
}

export interface GetTabs_getTabs {
  __typename: "Tab";
  id: string;
  trackTitle: string;
  artist: GetTabs_getTabs_artist | null;
}

export interface GetTabs {
  getTabs: GetTabs_getTabs[];
}
