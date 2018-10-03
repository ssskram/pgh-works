
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Phases from '../../store/phases'
import * as Projects from '../../store/projects'
import PhaseFilters from '../Filters/PhaseFilter'
import Table from 'react-table'

const iconStyle = {
    color: '#fff',
    marginTop: '-5px',
    paddingRight: '15px',
    paddingLeft: '15px'
}

export class AllPhases extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            phases: props.phases.sort(function (a, b) {
                return +new Date(b.expectedEndDate) - +new Date(a.expectedEndDate);
            }),
            redirectLink: '',
            redirect: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()
    }

    getPhaseLink(phaseID) {
        this.setState({
            redirectLink: "/Phase/id=" + phaseID,
            redirect: true
        })
    }

    returnProjectName(projectID) {
        const project = this.props.projects.find(function (project) {
            return project.projectID == projectID
        })
        return project.projectName
    }

    public render() {
        const {
            phases,
            redirectLink,
            redirect
        } = this.state

        const columns = [{
            Header: 'Phase',
            accessor: 'phaseName'
        }, {
            Header: 'Project',
            accessor: 'projectID',
            Cell: props => <div>{this.returnProjectName(props.value)}</div>
        }, {
            Header: 'Status',
            accessor: 'phaseStatus',
        }, {
            Header: '',
            accessor: 'phaseID',
            Cell: props => <button onClick={() => this.getPhaseLink(props.value)} className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></button>,
            maxWidth: 100
        }]

        if (redirect) {
            return <Redirect to={redirectLink} />
        }

        return (
            <div>
                <h2>All Phases <span style={{ marginTop: '-10px' }} className='pull-right'><PhaseFilters /></span></h2>
                <hr />
                {phases.length > 0 &&
                    <Table
                        data={phases}
                        columns={columns}
                        loading={false}
                        minRows={0}
                        pageSize={50}
                        showPageJump={false}
                        showPagination={phases.length > 50}
                        showPageSizeOptions={false}
                        noDataText=''
                        getTdProps={() => ({
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                fontSize: '16px'
                            }
                        })}
                    />
                }
                {phases.length == 0 &&
                    <div className='col-md-12 text-center'>
                        <br />
                        <h1><span><img style={iconStyle} src='./images/nothing.png' /></span></h1>
                        <h2><i>Nothing to see here</i></h2>
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.phases,
        ...state.projects
    }),
    ({
        ...Ping.actionCreators,
        ...Phases.actionCreators,
        ...Projects.actionCreators
    })
)(AllPhases as any) as typeof AllPhases