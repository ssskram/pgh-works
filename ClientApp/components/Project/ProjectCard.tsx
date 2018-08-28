
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

const descContainer = {
    margin: '25px 0px',
    borderRadius: '5px',
    padding: '20px 40px',
    backgroundColor: 'rgba(92, 184, 92, .08)',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)'
}

export default class ProjectCard extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }
    
    public render() {
        const {
            cartegraphID,
            startDate,
            endDate,
            projectManager,
            projectMembers,
            projectDescription,
            projectStatus,
            expectedCost,
            actualCost,
            notes,
            created,
            createdBy,
            lastModifiedBy,
        } = this.props.project

        return (
            <div>
                <div className='row'>
                    <br/>
                    <div style={projectContainer} className='col-md-6'>
                        <table className="table">
                            <tbody>
                                <tr style={bigFont}>
                                    <th style={borderNone} scope="row">Status</th>
                                    <td style={borderNone}>{projectStatus}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Start date</th>
                                    <td><Moment format="MM/DD/YYYY" date={startDate} /></td>
                                </tr>
                                <tr>
                                    <th scope="row">End date</th>
                                    <td><Moment format="MM/DD/YYYY" date={endDate} /></td>
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
                                {expectedCost &&
                                    <tr>
                                        <th scope="row">Expected cost</th>
                                        <td>{expectedCost}</td>
                                    </tr>
                                }
                                {actualCost &&
                                    <tr>
                                        <th scope="row">Actual cost</th>
                                        <td>{actualCost}</td>
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
                <div className='row'>
                    {projectDescription &&
                        <div style={descContainer} className='col-md-12'>
                            <h3>Project description</h3>
                            <hr />
                            <div style={bigFont}>{projectDescription}</div>
                        </div>
                    }
                </div>
            </div>
        )
    }
}
