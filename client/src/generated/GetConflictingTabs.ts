/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetConflictingTabs
// ====================================================

export interface GetConflictingTabs_getConflictingTabs {
  __typename: "Tab";
  id: string;
}

export interface GetConflictingTabs {
  getConflictingTabs: GetConflictingTabs_getConflictingTabs[];
}

export interface GetConflictingTabsVariables {
  title: string;
  artist: string;
}
