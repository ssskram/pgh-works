
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ApplicationState } from '../../store'
import Hydrate from './../Utilities/HydrateStore'
import * as Ping from '../../store/GETS/ping'
import * as Phases from '../../store/phases'
import * as Projects from '../../store/projects'
import PhaseFilters from '../Filters/PhaseFilter'
import Paging from '../Utilities/Paging'
import { returnPageNumber, returnCurrentItems } from './../../functions/paging'
import Spinner from './../Utilities/Spinner'

const imgHeight = {
    height: '50px'
}

const padding15 = {
    padding: '15px'
}

const emptyNotice = {
    letterSpacing: '2px'
}

export class AllPhases extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            phases: [],
            onFilter: false,
            currentPage: 1,
            redirectLink: '',
            redirect: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        if (this.props.phases.length > 0) {
            this.setState({
                phases: this.props.phases.sort(function (a, b) {
                    return +new Date(b.expectedEndDate) - +new Date(a.expectedEndDate);
                })
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps && this.state.onFilter == false) {
            if (nextProps.phases.length > 0) {
                this.setState({
                    phases: nextProps.phases.sort(function (a, b) {
                        return +new Date(b.expectedEndDate) - +new Date(a.expectedEndDate);
                    }),
                })
            }
        }
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

    receiveFilteredPhases(phases) {
        this.setState({
            phases: phases.sort(function (a, b) {
                return +new Date(b.expectedEndDate) - +new Date(a.expectedEndDate);
            }),
            onFilter: true
        })
    }

    public render() {
        const {
            phases,
            currentPage,
            redirectLink,
            redirect,
            onFilter
        } = this.state

        if (redirect) {
            return <Redirect push to={redirectLink} />
        }

        const currentItems = returnCurrentItems(phases, currentPage)
        const pageNumbers = returnPageNumber(phases)
        const renderItems = currentItems.map((phase, index) => {
            return <div className='col-md-12' key={index}>
                <div className='panel'>
                    <div onClick={() => this.getPhaseLink(phase.phaseID)} className='panel-body text-center panel-button'>
                        <div className='col-md-5'>
                            <img src='./images/phaseGrey.png' style={imgHeight} />
                            <h4><b>{phase.phaseName}</b></h4>
                        </div>
                        <div style={padding15}>
                            <div className='col-md-7'>
                                <h3><b>{this.returnProjectName(phase.projectID)}</b></h3>
                                <h5><i>Project</i></h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        })

        return (
            <div>
                <Hydrate />
                {phases.length == 0 && onFilter == false &&
                    <Spinner notice='...loading the phases...' />
                }
                <h2>
                    All Phases
                    <span style={{ marginTop: '-5px' }} className='pull-right'>
                        <PhaseFilters
                            returnFiltered={this.receiveFilteredPhases.bind(this)} />
                    </span>
                </h2>
                <hr />
                {phases.length > 0 &&
                    <div className='col-md-12'>
                        {renderItems}
                        <br />
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
                }
                {phases.length == 0 && onFilter == true &&
                    <div className='col-md-12' style={{ margin: '20px 0px' }}>
                        <div className='text-center alert alert-info'>
                            <h2 style={emptyNotice}>No phases matching those criteria</h2>
                        </div>
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