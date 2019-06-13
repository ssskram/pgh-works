import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

const setTimeline = "setTimeline";

const unloadedState: TimelineState = {
  timeline: ""
};

export interface TimelineState {
  timeline: string;
}

export const actionCreators = {
  setTimeline: (projects): AppThunkAction<any> => (dispatch, getState) => {
    dispatch({
      type: setTimeline,
      projects
    });
  }
};

export const reducer: Reducer<TimelineState> = (
  state: TimelineState,
  incomingAction: Action
) => {
  const action = incomingAction as any;
  switch (action.type) {
    case setTimeline:
      return {
        ...state,
        timeline: action.projects
      };
  }

  return state || unloadedState;
};
