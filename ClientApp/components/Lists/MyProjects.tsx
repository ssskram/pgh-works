
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ApplicationState } from '../../store'
import Hydrate from './../Utilities/HydrateStore'
import * as Ping from '../../store/GETS/ping'
import * as Projects from '../../store/projects'
import * as Personnel from '../../store/GETS/personnel'
import * as User from '../../store/GETS/user'
import ProjectFilters from '../Filters/ProjectFilter'
import Paging from '../Utilities/Paging'
import { returnPageNumber, returnCurrentItems } from './../../functions/paging'
import MapThumbnail from '../Maps/MapThumbnail'
import getMyProjects from './../../functions/myProjects'
import Spinner from './../Utilities/Spinner'
import { Ghost } from 'react-kawaii'

const emptyNotice = {
    letterSpacing: '2px'
}

const linePadding = {
    padding: '3px 0px'
}

export class MyProjects extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            onFilter: false,
            projects: [],
            currentPage: 1
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        this.setMyProjects(this.props)
        this.props.ping()
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.onFilter == false) {
            this.setMyProjects(nextProps)
        }
    }

    setMyProjects(props) {
        if (props.projects.length > 0 && props.personnel.length > 0 && props.user != '') {
            this.setState({
                projects: getMyProjects(props.projects, props.personnel, props.user)
            })
        }
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

    receiveFilteredProjects(projects) {
        this.setState({
            projects: getMyProjects(projects, this.props.personnel, this.props.user),
            onFilter: true
        })
    }

    public render() {
        const {
            onFilter,
            projects,
            currentPage
        } = this.state

        const currentItems = returnCurrentItems(projects, currentPage)
        const pageNumbers = returnPageNumber(projects)

        const renderItems = currentItems.map((project, index) => {
            const clearfix = index & 1 && index != 0
            const link = "/Project/id=" + project.projectID
            return <div key={index}>
                <div className='col-md-6 col-sm-12'>
                    <div className='panel panel-button'>
                        <Link to={link}>
                            <div className='panel-body text-center'>
                                <div className='col-md-12'>
                                    <MapThumbnail shape={project.shape.points} />
                                    <h3 style={{ marginTop: '15px' }}><b>{project.projectName}</b></h3>
                                    {project.projectLocation &&
                                        <h5 style={linePadding}><i>{project.projectLocation}</i></h5>
                                    }
                                    {project.projectDescription &&
                                        <h4 style={linePadding}>"{project.projectDescription}"</h4>
                                    }
                                    {project.actualStartDate && project.actualEndDate &&
                                        < h5 style={linePadding}>{project.actualStartDate} - {project.actualEndDate}</h5>
                                    }
                                    {!project.actualStartDate && !project.actualEndDate &&
                                        <h5 style={linePadding}>{project.expectedStartDate} - {project.expectedEndDate}</h5>
                                    }
                                    {!project.actualStartDate || !project.actualEndDate &&
                                        <h5 style={linePadding}>{project.expectedStartDate} - {project.expectedEndDate}</h5>
                                    }
                                    <h5 style={linePadding}>Status: <b>{project.projectStatus}</b></h5>
                                    <h5 style={linePadding}>PM: <b>{project.projectManager}</b></h5>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
                {clearfix == true &&
                    <div className="clearfix"></div>
                }
            </div>
        })

        return (
            <div>
                <Hydrate />
                <h2>
                    My Projects
                    <span style={{ marginTop: '-10px' }} className='pull-right'>
                        <ProjectFilters
                            filterType="mine"
                            returnFiltered={this.receiveFilteredProjects.bind(this)}
                        />
                    </span>
                </h2>
                <hr />
                {this.props.projects.length == 0 &&
                    <Spinner notice='...loading your projects...' />
                }
                {projects.length > 0 &&
                    <div className='row'>
                        {renderItems}
                        < br />
                        <Paging
                            count={projects}
                            currentPage={currentPage}
                            totalPages={pageNumbers}
                            next={this.handleNextClick.bind(this)}
                            prev={this.handlePreviousClick.bind(this)} />
                        <br />
                        <br />
                    </div>
                }
                {projects.length == 0 && onFilter == true &&
                    <div className='col-md-12' style={{ margin: '20px 0px' }}>
                        <div className='text-center alert alert-info'>
                            <h2 style={emptyNotice}>No projects matching those criteria</h2>
                        </div>
                    </div>
                }
                {this.props.projects.length > 0 && projects.length == 0 && onFilter == false &&
                    <div className='col-md-12 text-center' style={{ margin: '20px 0px' }}>
                        <Ghost size={200} mood="shocked" color="#AED3E5" />
                        <div className='alert alert-info'>
                            <h3 style={emptyNotice}><i>You don't have any projects</i></h3>
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
        ...state.projects,
        ...state.personnel,
        ...state.user
    }),
    ({
        ...Ping.actionCreators,
        ...Projects.actionCreators,
        ...Personnel.actionCreators,
        ...User.actionCreators
    })
)(MyProjects as any) as typeof MyProjects