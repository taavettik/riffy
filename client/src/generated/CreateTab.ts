/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateTab
// ====================================================

export interface CreateTab_createTab_artist {
  __typename: "Artist";
  id: string;
  name: string;
}

export interface CreateTab_createTab {
  __typename: "Tab";
  id: string;
  artist: CreateTab_createTab_artist | null;
}

export interface CreateTab {
  createTab: CreateTab_createTab;
}

export interface CreateTabVariables {
  title: string;
  chords: string;
  artist: string;
  trackId?: string | null;
  artistId?: string | null;
}
