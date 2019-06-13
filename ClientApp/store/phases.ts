import { fetch } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

const loadPhases = "loadPhases";
const addPhase = "addPhases";
const updatePhase = "updatePhases";
const deletePhase = "deletePhase";

const unloadedState: PhaseState = {
  phases: []
};

export interface PhaseState {
  phases: PhaseItem[];
}

export interface PhaseItem {
  cartegraphID: string;
  phaseID: string;
  projectID: string;
  phaseName: string;
  phaseType: string;
  phaseDescription: string;
  expectedStartDate: string;
  expectedEndDate: string;
  actualStartDate: string;
  actualEndDate: string;
  phaseStatus: string;
  notes: string;
}

export const actionCreators = {
  loadPhases: (): AppThunkAction<any> => (dispatch, getState) => {
    fetch("/api/phases/loadPhases", {
      credentials: "same-origin",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
      }
    })
      .then(response => response.json() as Promise<PhaseItem[]>)
      .then(data => {
        dispatch({ type: loadPhases, phases: data });
      });
  },
  addPhase: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/phases/addPhase", {
      method: "POST",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: addPhase,
      item
    });
  },
  updatePhase: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/phases/updatePhase", {
      method: "PUT",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: updatePhase,
      item
    });
  },
  deletePhase: (item): AppThunkAction<any> => (dispatch, getstate) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/phases/deletePhase", {
      method: "DELETE",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: deletePhase,
      item
    });
  }
};

export const reducer: Reducer<PhaseState> = (
  state: PhaseState,
  incomingAction: Action
) => {
  const action = incomingAction as any;
  switch (action.type) {
    case loadPhases:
      return {
        ...state,
        phases: action.phases
      };
    case addPhase:
      return {
        ...state,
        phases: state.phases.concat(action.item)
      };
    case updatePhase:
      return {
        ...state,
        phases: state.phases.map(phase =>
          phase.phaseID === action.item.phaseID
            ? {
                ...phase,
                cartegraphID: action.item.cartegraphID,
                projectID: action.item.projectID,
                phaseID: action.item.phaseID,
                phaseName: action.item.phaseName,
                phaseType: action.item.phaseType,
                expectedStartDate: action.item.expectedStartDate,
                expectedEndDate: action.item.expectedEndDate,
                actualStartDate: action.item.actualStartDate,
                actualEndDate: action.item.actualEndDate,
                phaseDescription: action.item.phaseDescription,
                phaseStatus: action.item.phaseStatus,
                notes: action.item.notes
              }
            : phase
        )
      };
    case deletePhase:
      let phasesCopy = state.phases.slice();
      phasesCopy.splice(phasesCopy.indexOf(action.item), 1);
      return {
        ...state,
        phases: phasesCopy
      };
  }

  return state || unloadedState;
};
