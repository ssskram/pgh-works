
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Phases from '../../store/phases'
import * as Projects from '../../store/projects'
import PhaseFilters from '../Filters/PhaseFilter'
import Paging from '../Utilities/Paging'

const iconStyle = {
    color: '#fff',
    marginTop: '-5px',
    paddingRight: '15px',
    paddingLeft: '15px'
}

const projectContainer = {
    backgroundColor: 'rgba(92, 184, 92, .1)',
    padding: '5px',
    borderRadius: '10px'
}

export class AllPhases extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            phases: props.phases.sort(function (a, b) {
                return +new Date(b.expectedEndDate) - +new Date(a.expectedEndDate);
            }),
            currentPage: 1,
            itemsPerPage: 30
        }
    }
    componentDidMount() {
        // ping server
        this.props.ping()
    }

    handleNextClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current + 1
        });
    }

    handlePreviousClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current - 1
        });
    }

    public render() {
        const {
            phases,
            currentPage,
            itemsPerPage
        } = this.state

        // Logic for paging
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = phases.slice(indexOfFirstItem, indexOfLastItem);
        const renderItems = currentItems.map((phase, index) => {
            const project = this.props.projects.find(function (project) {
                return project.projectID == phase.projectID
            })
            const totalPhases = this.props.phases.filter(function (phase) {
                return phase.projectID == phase.projectID
            })
            const countPhases = totalPhases.length
            const link = "/Phase/id=" + phase.phaseID
            return <div className='col-md-12' key={index}>
                <div className='panel'>
                    <div className='panel-body text-center'>
                        <div className='col-md-5'>
                            <h3><b>{phase.phaseName}</b></h3>
                            <h4><i>{phase.expectedStartDate} - {phase.expectedEndDate}</i></h4>
                            <h4>Type: <b>{phase.phaseType}</b></h4>
                            <h4>Status: <b>{phase.phaseStatus}</b></h4>
                        </div>
                        <div className='col-md-4' style={projectContainer}>
                            <h4><b>Project</b></h4>
                            <h3>{project.projectName}</h3>
                            <h4>Phase 1/{countPhases}</h4>
                        </div>
                        <div style={{ paddingTop: '10px' }} className='col-md-3'>
                            <Link to={link} className='btn btn-success'><h2><span style={iconStyle} className='glyphicon glyphicon-arrow-right'></span></h2></Link>
                        </div>
                    </div>
                </div>
            </div>
        })

        // Logic for displaying page numbers
        const pageNumbers: any[] = []
        for (let i = 1; i <= Math.ceil(phases.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <div>
                <h2>All Phases <span style={{ marginTop: '-10px' }} className='pull-right'><PhaseFilters /></span></h2>
                <hr />
                {renderItems}
                <br />
                <Paging
                    count={phases}
                    currentPage={currentPage}
                    totalPages={pageNumbers}
                    next={this.handleNextClick.bind(this)}
                    prev={this.handlePreviousClick.bind(this)} />
                <br />
                <br />
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