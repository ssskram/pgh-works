
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import ProjectFields from './../../Inputs/Project'
import * as moment from 'moment'

export class ProjectDescription extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            projectName: '',
            startDate: '',
            endDate: '',
            projectManager: '',
            projectMembers: '',
            projectDescription: '',
            projectStatus: '',
            expectedCost: '',
            actualCost: '',
            notes: ''
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    handleMultiSelect (field, value) {
        console.log('here')
        console.log(field)
        console.log(value)
        this.setState({ [field] : value })
    }

    handleStartDate(date) {
        if (date) {
            this.setState({
                startDate: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                startDate: null
            });
        }
    }

    handleEndDate(date) {
        if (date) {
            this.setState({
                endDate: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                endDate: null
            });
        }
    }

    public render() {
        return (
            <div>
                <ProjectFields
                    description={this.state}
                    handleInput={this.handleChildChange.bind(this)}
                    handleSelect={this.handleChildSelect.bind(this)}
                    handleMulti={this.handleMultiSelect.bind(this)}
                    handleStartDate={this.handleStartDate.bind(this)}
                    handleEndDate={this.handleEndDate.bind(this)}
                />
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({

    }),
    ({

    })
)(ProjectDescription as any) as typeof ProjectDescription