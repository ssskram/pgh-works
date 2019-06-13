import { fetch } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./../";

const loadPersonnel = "loadPersonnel";

const unloadedState: PersonnelState = {
  personnel: []
};

export interface PersonnelState {
  personnel: PersonnelItem[];
}

export interface PersonnelItem {
  email: string;
  title: string;
}

export const actionCreators = {
  loadPersonnel: (): AppThunkAction<any> => (dispatch, getState) => {
    fetch("/api/personnel/loadPersonnel", {
      credentials: "same-origin",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
      }
    })
      .then(response => response.json() as Promise<PersonnelItem[]>)
      .then(data => {
        dispatch({ type: loadPersonnel, personnel: data });
      });
  }
};

export const reducer: Reducer<PersonnelState> = (
  state: PersonnelState,
  incomingAction: Action
) => {
  const action = incomingAction as any;
  switch (action.type) {
    case loadPersonnel:
      return {
        ...state,
        personnel: action.personnel
      };
  }

  return state || unloadedState;
};
