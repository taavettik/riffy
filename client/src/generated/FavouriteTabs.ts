/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: FavouriteTabs
// ====================================================

export interface FavouriteTabs_favouriteTabs_ExternalTab {
  __typename: "ExternalTab";
  url: string;
  trackTitle: string;
  trackArtist: string;
  isFavourite: boolean;
}

export interface FavouriteTabs_favouriteTabs_Tab_artist {
  __typename: "Artist";
  id: string;
  name: string;
}

export interface FavouriteTabs_favouriteTabs_Tab {
  __typename: "Tab";
  id: string;
  trackTitle: string;
  artist: FavouriteTabs_favouriteTabs_Tab_artist | null;
  isFavourite: boolean;
}

export type FavouriteTabs_favouriteTabs = FavouriteTabs_favouriteTabs_ExternalTab | FavouriteTabs_favouriteTabs_Tab;

export interface FavouriteTabs {
  favouriteTabs: FavouriteTabs_favouriteTabs[];
}
