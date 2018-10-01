
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Projects from '../../store/projects'
import * as Phases from '../../store/phases'
import Select from '../FormElements/select'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

export class PhaseFollows extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            projects: [],
            phases: [],
            project: '',
            phase: ''
        }
        this.setPhases = this.setPhases.bind(this)
    }

    componentDidMount() {
        this.setProjectDropdowns(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.setProjectDropdowns(nextProps)
    }

    setProjectDropdowns(props) {
        let projects = [] as any
        props.projects.forEach(function (project) {
            let json = { "value": project.projectID, "label": project.projectName, "name": 'project' }
            projects.push(json)
        })
        this.setState({
            projects: projects
        })
    }

    handleChildSelect(event) {
        this.setState({
            [event.name]: event.value
        }, function (this) {
            if (event.name == 'project') {
                this.setPhases(event.value)
            }
            if (event.name == 'phase') {
                this.returnPhaseFollows()
            }
        })
    }

    setPhases(projectID) {
        let phases = [] as any
        let relevantPhases = this.props.phases.filter(function (item) {
            return item.projectID == projectID
        })
        relevantPhases.forEach(function (phase) {
            let json = { "value": phase.phaseID, "label": phase.phaseName, "name": 'phase' }
            phases.push(json)
        })
        this.setState({
            phases: phases
        })
    }

    returnPhaseFollows() {
        const phaseFollows = {
            project: this.state.project,
            phase: this.state.phase
        }
        this.props.passFollows(phaseFollows)
    }

    public render() {
        const {
            project,
            phase,
            projects,
            phases
        } = this.state

        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                <h3>Phase follows</h3>
                <hr />
                <div className='col-md-12'>
                    <Select
                        value={project}
                        name="project"
                        header='Select preceding project'
                        placeholder='Select project'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        options={projects}
                    />
                </div>
                {project != '' &&
                    <div className='col-md-12'>
                        <Select
                            value={phase}
                            name="phase"
                            header='Select preceding phase'
                            placeholder='Select phase'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={phases}
                        />
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.projects,
        ...state.phases
    }),
    ({
        ...Projects.actionCreators,
        ...Phases.actionCreators
    })
)(PhaseFollows as any) as typeof PhaseFollows