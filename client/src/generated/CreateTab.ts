/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTab
// ====================================================

export interface CreateTab_createTab_artist_tabs {
  __typename: "Tab";
  id: string;
  trackTitle: string;
}

export interface CreateTab_createTab_artist {
  __typename: "Artist";
  id: string;
  name: string;
  tabs: CreateTab_createTab_artist_tabs[];
}

export interface CreateTab_createTab {
  __typename: "Tab";
  id: string;
  artist: CreateTab_createTab_artist | null;
  chords: string;
}

export interface CreateTab {
  createTab: CreateTab_createTab;
}

export interface CreateTabVariables {
  title: string;
  chords: string;
  artist: string;
}
