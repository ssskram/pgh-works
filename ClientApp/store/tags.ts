import { fetch } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

const loadTags = "loadTags";
const addTag = "addTags";
const deleteTag = "deleteTags";

const unloadedState: TagState = {
  tags: []
};

export interface TagState {
  tags: TagItem[];
}

export interface TagItem {
  tagID: string;
  parentID: string;
  parentType: string;
  parentName: string;
  taggedAssetOID: string;
  taggedAssetName: string;
  tagType: string;
  tagDescription: string;
}

export const actionCreators = {
  loadTags: (): AppThunkAction<any> => (dispatch, getState) => {
    fetch("/api/tags/loadTags", {
      credentials: "same-origin",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
      }
    })
      .then(response => response.json() as Promise<TagItem[]>)
      .then(data => {
        dispatch({ type: loadTags, tags: data });
      });
  },

  addTag: (item): AppThunkAction<any> => async (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    await fetch("/api/tags/addTag", {
      method: "POST",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: addTag,
      item
    });
  },

  deleteTag: (item): AppThunkAction<any> => async (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    await fetch("/api/tags/deleteTag", {
      method: "DELETE",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: deleteTag,
      item
    });
  }
};

export const reducer: Reducer<TagState> = (
  state: TagState,
  incomingAction: Action
) => {
  const action = incomingAction as any;
  switch (action.type) {
    case loadTags:
      return {
        ...state,
        tags: action.tags
      };
    case addTag:
      return {
        ...state,
        tags: state.tags.concat(action.item)
      };
    case deleteTag:
      let tagsCopy = state.tags.slice();
      tagsCopy.splice(tagsCopy.indexOf(action.item), 1);
      return {
        ...state,
        tags: tagsCopy
      };
  }

  return state || unloadedState;
};
