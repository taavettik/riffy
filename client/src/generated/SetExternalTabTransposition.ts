/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetExternalTabTransposition
// ====================================================

export interface SetExternalTabTransposition_setExternalTabTransposition {
  __typename: "ExternalTab";
  url: string;
  transposition: number;
}

export interface SetExternalTabTransposition {
  setExternalTabTransposition: SetExternalTabTransposition_setExternalTabTransposition;
}

export interface SetExternalTabTranspositionVariables {
  url: string;
  transposition: number;
}
