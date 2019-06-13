import { fetch } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

const loadSubphases = "loadSubphases";
const addSubphase = "addSubphases";
const updateSubphase = "updateSubphases";
const deleteSubphase = "deleteSubphases";

const unloadedState: SubphaseState = {
  subphases: []
};

export interface SubphaseState {
  subphases: SubphaseItem[];
}

export interface SubphaseItem {
  cartegraphID: string;
  subphaseID: string;
  subphaseName: string;
  startDate: string;
  endDate: string;
  phaseID: string;
  projectID: string;
  subphaseStatus: string;
  subphaseDescription: string;
  percentComplete: number;
  notes: string;
}

export const actionCreators = {
  loadSubphases: (): AppThunkAction<any> => (dispatch, getState) => {
    fetch("/api/subphases/loadSubphases", {
      credentials: "same-origin",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
      }
    })
      .then(response => response.json() as Promise<SubphaseItem[]>)
      .then(data => {
        dispatch({ type: loadSubphases, subphases: data });
      });
  },
  addSubphase: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/subphases/addSubphase", {
      method: "POST",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: addSubphase,
      item
    });
  },
  updateSubphase: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/subphases/updateSubphase", {
      method: "PUT",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: updateSubphase,
      item
    });
  },
  deleteSubphase: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/subphases/deleteSubphase", {
      method: "DELETE",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: deleteSubphase,
      item
    });
  }
};

export const reducer: Reducer<SubphaseState> = (
  state: SubphaseState,
  incomingAction: Action
) => {
  const action = incomingAction as any;
  switch (action.type) {
    case loadSubphases:
      return {
        ...state,
        subphases: action.subphases
      };
    case addSubphase:
      return {
        ...state,
        subphases: state.subphases.concat(action.item)
      };
    case updateSubphase:
      return {
        ...state,
        subphases: state.subphases.map(subphase =>
          subphase.subphaseID === action.item.subphaseID
            ? {
                ...subphase,
                cartegraphID: action.item.cartegraphID,
                projectID: action.item.projectID,
                subphaseID: action.item.subphaseID,
                subphaseName: action.item.subphaseName,
                startDate: action.item.startDate,
                endDate: action.item.endDate,
                subphaseDescription: action.item.subphaseDescription,
                subphaseStatus: action.item.subphaseStatus,
                percentComplete: action.item.percentComplete,
                notes: action.item.notes
              }
            : subphase
        )
      };
    case deleteSubphase:
      let subphasesCopy = state.subphases.slice();
      subphasesCopy.splice(subphasesCopy.indexOf(action.item), 1);
      return {
        ...state,
        subphases: subphasesCopy
      };
  }

  return state || unloadedState;
};
