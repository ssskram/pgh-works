
import * as React from 'react'
import Moment from 'react-moment'

const bigFont = {
    fontSize: '18px'
}

const borderNone = {
    border: 'none'
}

const projectContainer = {
    backgroundColor: '#f3fafe',
    borderRadius: '10px',
    padding: '10px',
    margin: '5px 0px',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)'
}

const metaContainer = {
    margin: '5px 0px',
    padding: '20px 0px 0px 30px'
}

export default class ProjectCard extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    public render() {
        const {
            cartegraphID,
            projectManager,
            projectMembers,
            projectDepartment,
            projectDescription,
            projectStatus,
            notes,
            created,
            createdBy,
            lastModifiedBy,
        } = this.props.project

        return (
            <div>
                <div className='row'>
                    <br />
                    <div style={projectContainer} className='col-md-6'>
                        <table className="table">
                            <tbody>
                                <tr style={bigFont}>
                                    <th style={borderNone} scope="row">Status</th>
                                    <td style={borderNone}>{projectStatus}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Project department</th>
                                    <td>{projectDepartment}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Project manager</th>
                                    <td>{projectManager}</td>
                                </tr>
                                {projectMembers &&
                                    <tr>
                                        <th scope="row">Project members</th>
                                        <td>{projectMembers}</td>
                                    </tr>
                                }
                                {projectDescription &&
                                    <tr>
                                        <th scope="row">Project description</th>
                                        <td>{projectDescription}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div style={metaContainer} className='col-md-6'>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th style={borderNone} scope="row">Project created</th>
                                    <td style={borderNone}>{created}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Created by</th>
                                    <td>{createdBy}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Last modified by</th>
                                    <td>{lastModifiedBy}</td>
                                </tr>
                                {cartegraphID &&
                                    <tr>
                                        <th scope="row">Cartegraph ID</th>
                                        <td>{cartegraphID}</td>
                                    </tr>
                                }
                                {notes &&
                                    <tr>
                                        <th scope="row">Notes</th>
                                        <td>{notes}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
