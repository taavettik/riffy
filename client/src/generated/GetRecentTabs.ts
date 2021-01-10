/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetRecentTabs
// ====================================================

export interface GetRecentTabs_recentTabs_ExternalTab {
  __typename: "ExternalTab";
  trackTitle: string;
  trackArtist: string;
  url: string;
}

export interface GetRecentTabs_recentTabs_Tab_artist {
  __typename: "Artist";
  name: string;
}

export interface GetRecentTabs_recentTabs_Tab {
  __typename: "Tab";
  trackTitle: string;
  artist: GetRecentTabs_recentTabs_Tab_artist | null;
  id: string;
}

export type GetRecentTabs_recentTabs = GetRecentTabs_recentTabs_ExternalTab | GetRecentTabs_recentTabs_Tab;

export interface GetRecentTabs {
  recentTabs: GetRecentTabs_recentTabs[];
}
