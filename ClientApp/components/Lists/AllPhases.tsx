
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
            let src = ''
            if (phase.phaseStatus == "On hold") {
                src = './images/onHold.png'
            }
            return <div className='col-lg-4 col-md-6 col-sm-12 col-xs-12' key={index}>
                <div onClick={() => this.getPhaseLink(phase.phaseID)} className='panel panel-button'>
                    <div className='panel-body text-center'>
                        <div>
                            <div className='col-md-12'>
                                <h2><b>{phase.phaseName}</b></h2>
                                <h6><i>Project</i></h6>
                                <h4>{this.returnProjectName(phase.projectID)}</h4>
                                <h6><i>Status</i></h6>
                                <h4>{phase.phaseStatus}</h4>
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