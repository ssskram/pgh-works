
import * as React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Projects from '../../store/projects'
import ProjectFilters from '../Filters/ProjectFilter'
import Paging from '../Utilities/Paging'
import MapThumbnail from '../Maps/MapThumbnail'

const iconStyle = {
    color: '#fff',
    marginTop: '-5px',
    paddingRight: '15px',
    paddingLeft: '15px'
}

export class AllProjects extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            projects: props.projects.sort(function (a, b) {
                return +new Date(b.expectedEndDate) - +new Date(a.expectedEndDate)
            }),
            currentPage: 1,
            itemsPerPage: 30
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)

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

    receiveFilteredProjects(projects) {
        this.setState({
            projects: projects.sort(function (a, b) {
                return +new Date(b.expectedEndDate) - +new Date(a.expectedEndDate)
            })
        })
    }

    public render() {
        const {
            projects,
            currentPage,
            itemsPerPage
        } = this.state

        // Logic for paging
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = projects.slice(indexOfFirstItem, indexOfLastItem);
        const renderItems = currentItems.map((project, index) => {
            const link = "/Project/id=" + project.projectID
            return <div className='col-md-12' key={index}>
                <div className='panel'>
                    <div className='panel-body text-center'>
                        <div className='col-md-6'>
                            <h3><b>{project.projectName}</b></h3>
                            {project.actualStartDate && project.actualEndDate &&
                                <h4><i>{project.actualStartDate} - {project.actualEndDate}</i></h4>
                            }
                            {!project.actualStartDate && project.actualEndDate &&
                                <h4><i>{project.expectedStartDate} - {project.expectedEndDate}</i></h4>
                            }
                            <h4>Status: <b>{project.projectStatus}</b></h4>
                            <h4>Department: <b>{project.projectDepartment}</b></h4>
                            <h4>PM: <b>{project.projectManager}</b></h4>
                        </div>
                        <div className='col-md-3'>
                            <MapThumbnail shape={project.shape.points} />
                        </div>
                        <div style={{ paddingTop: '25px' }} className='col-md-3'>
                            <Link to={link} className='btn btn-success'><h2><span style={iconStyle} className='glyphicon glyphicon-arrow-right'></span></h2></Link>
                        </div>
                    </div>
                </div>
            </div>
        })

        // Logic for displaying page numbers
        const pageNumbers: any[] = []
        for (let i = 1; i <= Math.ceil(projects.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <div>
                <h2>
                    All Projects
                    <span style={{ marginTop: '-5px' }} className='pull-right'>
                        <ProjectFilters
                            filterType="all"
                            returnFiltered={this.receiveFilteredProjects.bind(this)}
                        />
                    </span>
                </h2>
                <hr />
                {projects.length > 0 &&
                    <div>
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
                {projects.length == 0 &&
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
        ...state.projects
    }),
    ({
        ...Ping.actionCreators,
        ...Projects.actionCreators
    })
)(AllProjects as any) as typeof AllProjects