
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ApplicationState } from '../../store'
import Hydrate from './../Utilities/HydrateStore'
import * as Ping from '../../store/GETS/ping'
import * as Projects from '../../store/projects'
import ProjectFilters from '../Filters/ProjectFilter'
import Paging from '../Utilities/Paging'
import { returnPageNumber, returnCurrentItems } from './../../functions/paging'
import MapThumbnail from '../Maps/MapThumbnail'
import Spinner from './../Utilities/Spinner'

const emptyNotice = {
    letterSpacing: '2px'
}

const linePadding = {
    padding: '3px 0px'
}

export class AllProjects extends React.Component<any, any> {
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
        if (this.props.projects.length > 0) {
            this.setState({
                projects: this.props.projects
            })
        }
        // ping server
        this.props.ping()
        console.log(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            if (nextProps.projects.length > 0) {
                this.setState({
                    projects: nextProps.projects
                })
            }
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
            projects: projects,
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
                {projects.length == 0 && onFilter == false &&
                    <Spinner notice='...loading the projects...' />
                }
                <h2>
                    All Projects
                    <span style={{ marginTop: '-15px' }} className='pull-right'>
                        <ProjectFilters
                            filterType="all"
                            returnFiltered={this.receiveFilteredProjects.bind(this)}
                        />
                    </span>
                </h2>
                <hr />
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
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.projects
    }),
    ({
        ...Ping.actionCreators,
        ...Projects.actionCreators
    })
)(AllProjects as any) as typeof AllProjects