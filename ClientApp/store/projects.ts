import { fetch } from 'domain-task';

const loadProjects = 'load'
const add = 'add'

// TODO
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
        console.log('here')
        console.log(item)
        dispatch({
            type: add, item
        })
    },
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
    }

    return state || unloadedState;
}