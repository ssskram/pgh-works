
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Phases from '../../store/phases'
import * as Projects from '../../store/projects'
import PhaseFilters from '../Filters/PhaseFilter'
import Table from 'react-table'


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
        // ping server
        this.props.ping()
    }

    getPhaseLink(phaseID) {
        this.setState ({
            redirectLink: "/Phase/id=" + phaseID,
            redirect: true
        })
    }

    returnProjectName (projectID) {
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
            Header: 'Type',
            accessor: 'phaseType',
        }, {
            Header: 'Status',
            accessor: 'phaseStatus',
        }, {
            Header: 'Project',
            accessor: 'projectID',
            Cell: props=> <div>{this.returnProjectName(props.value)}</div>
        }, {
            Header: '',
            accessor: 'phaseID',
            Cell: props => <button onClick={() => this.getPhaseLink(props.value)} className='btn btn-success'><span className='glyphicon glyphicon-eye-open'></span></button>,
            maxWidth: 100
        }]

        if (redirect) {
            return <Redirect to={redirectLink} />
        }

        return (
            <div>
                <h2>All Phases <span style={{ marginTop: '-10px' }} className='pull-right'><PhaseFilters /></span></h2>
                <hr />
                <Table
                    data={phases}
                    columns={columns}
                    loading={false}
                    minRows={0}
                    pageSize={50}
                    showPagination={true}
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