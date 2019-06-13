import { fetch } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";
import { broadcastActivity } from "../sockets/activity";

const loadActivity = "loadActivity";
const addActivity = "addActivity";

const unloadedState: ActivityState = {
  activity: []
};

export interface ActivityState {
  activity: ActivityItem[];
}

export interface ActivityItem {
  cartegraphID: string;
  activityID: string;
  parentID: string;
  parentType: string;
  user: string;
  activity: string;
  date: string;
}

export const actionCreators = {
  loadActivity: (): AppThunkAction<any> => (dispatch, getState) => {
    fetch("/api/activity/loadActivity", {
      credentials: "same-origin",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
      }
    })
      .then(response => response.json() as Promise<ActivityItem[]>)
      .then(data => {
        dispatch({ type: loadActivity, activity: data });
      });
  },
  addActivity: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/activity/addActivity", {
      method: "POST",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(() => broadcastActivity())
      .catch(err => console.log(err));
    dispatch({
      type: addActivity,
      item
    });
  },
  receiveActivity: (activity): AppThunkAction<any> => (dispatch, getState) => {
    dispatch({ type: loadActivity, activity: activity });
  }
};

export const reducer: Reducer<ActivityState> = (
  state: ActivityState,
  incomingAction: Action
) => {
  const action = incomingAction as any;
  switch (action.type) {
    case loadActivity:
      return {
        ...state,
        activity: action.activity
      };
    case addActivity:
      return {
        ...state,
        activity: state.activity.concat(action.item)
      };
  }

  return state || unloadedState;
};
