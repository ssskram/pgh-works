import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';


const loadProjects = 'load'
const add = 'add'
const update = 'update'

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
    startDate: string
    endDate: string
    projectManager: string
    projectMembers: string
    projectDescription: string
    projectStatus: string
    expectedCost: string
    actualCost: string
    notes: string
    created: string
    createdBy: string
    lastModifiedBy: string
    shape: Coords[]
}

export interface Coords {
    lat: string
    lng: string
}

export const actionCreators = {
    loadProjects: () => (dispatch) => {
        fetch('/api/projects/loadProjects', {
            credentials: 'same-origin',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            }
        })
        //     .then(response => response.json())
        //     .then(data => {
        //         dispatch({ type: loadProjects, projects: data.items });
        //     });
    },
    addProject: (item) => (dispatch) => {

        // post to cartegraph

        dispatch({
            type: add, item
        })
    },
    updateProject: (item) => (dispatch) => {

        // put to cartegraph
        
        dispatch({
            type: update, item
        })
    }
}

export const reducer = (state: ProjectState, action) => {
    switch (action.type) {
        case loadProjects:
            return {
                ...state,
                projects: action.projects
            };
        case add:
            return {
                ...state,
                projects: state.projects.concat(action.item)
            };
        case update:
            return {
                ...state,
                projects: state.projects.map(project => project.projectID === action.item.projectID ? { ...project,
                    cartegraphID: action.item.cartegraphID,
                    projectID: action.item.projectID,
                    projectName: action.item.projectName,
                    startDate: action.item.startDate,
                    endDate: action.item.endDate,
                    projectManager: action.item.projectManager,
                    projectMembers: action.item.projectMembers,
                    projectDescription: action.item.projectDescription,
                    projectStatus: action.item.projectStatus,
                    expectedCost: action.item.expectedCost,
                    actualCost: action.item.actualCost,
                    notes: action.item.notes,
                    created: action.item.created,
                    createdBy: action.item.createdBy,
                    lastModifiedBy: action.item.lastModifiedBy,
                    shape: action.item.shape
                    } : project
                )
            };
    }

    return state || unloadedState;
}