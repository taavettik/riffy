/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetTabTransposition
// ====================================================

export interface SetTabTransposition_setTabTransposition {
  __typename: "Tab";
  id: string;
  transposition: number;
}

export interface SetTabTransposition {
  setTabTransposition: SetTabTransposition_setTabTransposition;
}

export interface SetTabTranspositionVariables {
  id: string;
  transposition: number;
}
