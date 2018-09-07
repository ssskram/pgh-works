
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Projects from '../../store/projects'
import * as Phases from '../../store/phases'
import Select from '../FormElements/select'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

let projects = [] as any
let phases = [] as any

export class PhaseFollows extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            project: '',
            phase: ''
        }
        this.setPhases = this.setPhases.bind(this)
    }

    componentDidMount() {
        projects = []
        this.props.projects.forEach(function (project) {
            let json = { "value": project.projectName, "label": project.projectName, "name": 'project', "ID": project.projectID }
            projects.push(json)
        })
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value })
        if (event.name == 'project') {
            this.setPhases(event.ID)
        }
        if (event.name == 'phase') {
            this.returnWork(event.label)
        }
    }

    setPhases(projectID) {
        phases = []
        let relevantPhases = this.props.phases.filter(function (item) {
            return item.projectID == projectID
        })
        relevantPhases.forEach(function (phase) {
            let json = { "value": phase.phaseID, "label": phase.phaseName, "name": 'phase' }
            phases.push(json)
        })
    }

    returnWork(phase) {
        let precedingWork = 'Phase "' + phase + '" of project "' + this.state.project + '"'
        this.props.passFollows(precedingWork)
    }

    public render() {
        const {
            project,
            phase
        } = this.state
        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                <h3>Preceding work</h3>
                <hr />
                <div className='col-md-12'>
                    <Select
                        value={project}
                        name="project"
                        header='Select project'
                        placeholder='Select preceding project'
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
                            header='Select phase'
                            placeholder='Select preceding phase'
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