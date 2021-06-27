/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetUgTab
// ====================================================

export interface GetUgTab_getUgTab {
  __typename: "ExternalTab";
  trackTitle: string;
  trackArtist: string;
  chords: string;
  transposition: number;
  isFavourite: boolean;
}

export interface GetUgTab {
  getUgTab: GetUgTab_getUgTab | null;
}

export interface GetUgTabVariables {
  url: string;
}
