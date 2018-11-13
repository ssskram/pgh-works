import { fetch } from 'domain-task'
import { Action, Reducer } from 'redux'
import { AppThunkAction } from './'

const loadProjects = 'loadProjects'
const addProject = 'addProject'
const updateProject = 'updateProject'

const unloadedState: ProjectState = {
    projects: []
}

export interface ProjectState {
    projects: ProjectItem[]
}

export interface ProjectItem {
    cartegraphID: string
    projectID: string
    projectName: string
    expectedStartDate: string
    expectedEndDate: string
    actualStartDate: string
    actualEndDate: string
    projectManager: string
    projectMembers: string
    projectDepartment: string
    projectDescription: string
    projectStatus: string
    notes: string
    shape: Shape
}

export interface Shape {
    points: Points[]
    breaks: string[]
    shapeType: "3"
}

export interface Points {
    lat: string
    lng: string
}

export const actionCreators = {
    loadProjects: (): AppThunkAction<any> => (dispatch, getState) => {
        fetch('/api/projects/loadProjects', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
            .then(response => response.json() as Promise<ProjectItem[]>)
            .then(data => {
                dispatch({ type: loadProjects, projects: data });
            });
    },
    addProject: (item): AppThunkAction<any> => (dispatch, getState) => {
        let data = JSON.stringify(item).replace(/'/g, '')
        fetch('/api/projects/addProject', {
            method: 'POST',
            body: data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        dispatch({
            type: addProject, item
        })
    },
    updateProject: (item): AppThunkAction<any> => (dispatch, getState) => {
        let data = JSON.stringify(item).replace(/'/g, '')
        fetch('/api/projects/updateProject', {
            method: 'PUT',
            body: data,
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        dispatch({
            type: updateProject, item
        })
    }
}

export const reducer: Reducer<ProjectState> = (state: ProjectState, incomingAction: Action) => {
    const action = incomingAction as any;
    switch (action.type) {
        case loadProjects:
            return {
                ...state,
                projects: action.projects
            };
        case addProject:
            return {
                ...state,
                projects: state.projects.concat(action.item)
            };
        case updateProject:
            return {
                ...state,
                projects: state.projects.map(project => project.projectID === action.item.projectID ? {
                    ...project,
                    cartegraphID: action.item.cartegraphID,
                    projectID: action.item.projectID,
                    projectName: action.item.projectName,
                    expectedStartDate: action.item.expectedStartDate,
                    expectedEndDate: action.item.expectedEndDate,
                    actualStartDate: action.item.actualStartDate,
                    actualEndDate: action.item.actualEndDate,
                    projectManager: action.item.projectManager,
                    projectMembers: action.item.projectMembers,
                    projectDepartment: action.item.projectDepartment,
                    projectDescription: action.item.projectDescription,
                    projectStatus: action.item.projectStatus,
                    notes: action.item.notes,
                    shape: action.item.shape
                } : project
                )
            };
    }

    return state || unloadedState;
}