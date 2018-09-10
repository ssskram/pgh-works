
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Projects from '../../store/projects'
import ProjectFilters from '../Filters/ProjectFilter'

export class AllProjects extends React.Component<any, any> {
    constructor (props) {
        super(props)
        this.state = {
            projects: props.projects
        }
    }
    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        return (
            <div>
                <h2>All Projects <span style={{marginTop: '-10px'}} className='pull-right'><ProjectFilters /></span></h2>
                <hr/>
                <i className='text-center'>Return filterable list of all projects in system</i>
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