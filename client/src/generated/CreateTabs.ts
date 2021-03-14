/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TabData } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTabs
// ====================================================

export interface CreateTabs_createTabs_artist_tabs {
  __typename: "Tab";
  id: string;
}

export interface CreateTabs_createTabs_artist {
  __typename: "Artist";
  tabs: CreateTabs_createTabs_artist_tabs[];
}

export interface CreateTabs_createTabs {
  __typename: "Tab";
  id: string;
  artist: CreateTabs_createTabs_artist | null;
}

export interface CreateTabs {
  createTabs: CreateTabs_createTabs[];
}

export interface CreateTabsVariables {
  tabs: TabData[];
}
