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
  trackArtist: string | null;
  url: string;
}

export interface GetRecentTabs_recentTabs_Tab {
  __typename: "Tab";
  trackTitle: string;
  trackArtist: string | null;
  id: string;
}

export type GetRecentTabs_recentTabs = GetRecentTabs_recentTabs_ExternalTab | GetRecentTabs_recentTabs_Tab;

export interface GetRecentTabs {
  recentTabs: GetRecentTabs_recentTabs[];
}
