import { fetch } from "domain-task";
import { Action, Reducer } from "redux";
import { AppThunkAction } from "./";

const loadTasks = "loadTasks";
const addTask = "addTasks";
const updateTask = "updateTasks";
const deleteTask = "deleteTasks";

const unloadedState: TaskState = {
  tasks: []
};

export interface TaskState {
  tasks: TaskItem[];
}

export interface TaskItem {
  cartegraphID: string;
  taskID: string;
  taskName: string;
  phaseID: string;
  projectID: string;
  dueDate: string;
  percentComplete: number;
  dateCompleted: string;
  notes: string;
}

export const actionCreators = {
  loadTasks: (): AppThunkAction<any> => (dispatch, getState) => {
    fetch("/api/tasks/loadTasks", {
      credentials: "same-origin",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
      }
    })
      .then(response => response.json() as Promise<TaskItem[]>)
      .then(data => {
        dispatch({ type: loadTasks, tasks: data });
      });
  },
  addTask: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/tasks/addTask", {
      method: "POST",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: addTask,
      item
    });
  },
  updateTask: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/tasks/updateTask", {
      method: "PUT",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: updateTask,
      item
    });
  },
  deleteTask: (item): AppThunkAction<any> => (dispatch, getState) => {
    let data = JSON.stringify(item).replace(/'/g, "");
    fetch("/api/tasks/deleteTask", {
      method: "DELETE",
      body: data,
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    dispatch({
      type: deleteTask,
      item
    });
  }
};

export const reducer: Reducer<TaskState> = (
  state: TaskState,
  incomingAction: Action
) => {
  const action = incomingAction as any;
  switch (action.type) {
    case loadTasks:
      return {
        ...state,
        tasks: action.tasks
      };
    case addTask:
      return {
        ...state,
        tasks: state.tasks.concat(action.item)
      };
    case updateTask:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.taskID === action.item.taskID
            ? {
                ...task,
                cartegraphID: action.item.cartegraphID,
                projectID: action.item.projectID,
                taskID: action.item.taskID,
                phaseID: action.item.phaseID,
                taskName: action.item.taskName,
                dueDate: action.item.dueDate,
                dateCompleted: action.item.dateCompleted,
                percentComplete: action.item.percentComplete,
                notes: action.item.notes
              }
            : task
        )
      };
    case deleteTask:
      let tasksCopy = state.tasks.slice();
      tasksCopy.splice(tasksCopy.indexOf(action.item), 1);
      return {
        ...state,
        tasks: tasksCopy
      };
  }

  return state || unloadedState;
};
