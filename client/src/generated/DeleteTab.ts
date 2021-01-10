/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteTab
// ====================================================

export interface DeleteTab_deleteTab_tabs {
  __typename: "Tab";
  id: string;
}

export interface DeleteTab_deleteTab {
  __typename: "Artist";
  id: string;
  tabs: DeleteTab_deleteTab_tabs[];
}

export interface DeleteTab {
  deleteTab: DeleteTab_deleteTab;
}

export interface DeleteTabVariables {
  id: string;
}
