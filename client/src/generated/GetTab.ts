/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTab
// ====================================================

export interface GetTab_getTab_artist {
  __typename: "Artist";
  name: string;
}

export interface GetTab_getTab {
  __typename: "Tab";
  id: string;
  chords: string;
  trackTitle: string;
  artist: GetTab_getTab_artist | null;
  transposition: number;
  isFavourite: boolean;
}

export interface GetTab {
  getTab: GetTab_getTab;
}

export interface GetTabVariables {
  id: string;
}
