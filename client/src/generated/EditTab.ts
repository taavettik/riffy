/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: EditTab
// ====================================================

export interface EditTab_editTab {
  __typename: "Tab";
  id: string;
  chords: string;
}

export interface EditTab {
  editTab: EditTab_editTab;
}

export interface EditTabVariables {
  id: string;
  chords: string;
}
