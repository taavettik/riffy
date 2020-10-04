/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetTabs
// ====================================================

export interface GetTabs_getTabs {
  __typename: "Tab";
  id: string;
  trackTitle: string;
  trackArtist: string | null;
}

export interface GetTabs {
  getTabs: GetTabs_getTabs[];
}
