
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
                                <div className='col-md-12' style={{ padding: '15px' }}>
                                    <MapThumbnail shape={project.shape.points} />
                                    <h2><b>{project.projectName}</b></h2>
                                    {project.projectDescription &&
                                        <h3 style={linePadding}>"{project.projectDescription}"</h3>
                                    }
                                    {project.actualStartDate && project.actualEndDate &&
                                        <h4 style={linePadding}><i>{project.actualStartDate} - {project.actualEndDate}</i></h4>
                                    }
                                    {!project.actualStartDate && !project.actualEndDate &&
                                        <h4 style={linePadding}><i>{project.expectedStartDate} - {project.expectedEndDate}</i></h4>
                                    }
                                    {!project.actualStartDate || !project.actualEndDate &&
                                        <h4 style={linePadding}><i>{project.expectedStartDate} - {project.expectedEndDate}</i></h4>
                                    }
                                    <h4 style={linePadding}>Status: <b>{project.projectStatus}</b></h4>
                                    <h4 style={linePadding}>Department: <b>{project.projectDepartment}</b></h4>
                                    <h4 style={linePadding}>PM: <b>{project.projectManager}</b></h4>
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
                    <span style={{ marginTop: '-15px' }} className='pull-right'>
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
                    <div className='col-md-12' style={{ margin: '20px 0px' }}>
                        <div className='text-center alert alert-info'>
                            <h2 style={emptyNotice}>There are no projects associated with your account</h2>
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