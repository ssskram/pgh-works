
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import ProjectFields from '../../Inputs/Project'
import * as moment from 'moment'

const paddingLeft = {
    paddingLeft: '25px'
}

const paddingRight = {
    paddingRight: '25px'
}

export class ProjectDescription extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            projectName: '',
            expectedStartDate: '',
            expectedEndDate: '',
            actualStartDate: '',
            actualEndDate: '',
            projectManager: '',
            projectMembers: '',
            projectDepartment: '',
            projectDescription: '',
            notes: ''
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    handleMultiSelect(field, value) {
        this.setState({ [field]: value })
    }

    handleDate(date, name) {
        if (date) {
            this.setState({
                [name]: moment(date).format('MM/DD/YYYY')
            });
        } else {
            this.setState({
                [name]: null
            });
        }
    }

    post() {
        this.props.post(this.state)
    }

    back() {
        this.props.back()
    }

    public render() {
        const {
            projectName,
            expectedStartDate,
            expectedEndDate,
            projectManager,
            projectStatus
        } = this.state

        // validation
        const isEnabled =
            projectName != '' &&
            expectedStartDate != '' &&
            expectedEndDate != '' &&
            projectManager != '' &&
            projectStatus != ''

        return (
            <div>
                <ProjectFields
                    description={this.state}
                    handleInput={this.handleChildChange.bind(this)}
                    handleSelect={this.handleChildSelect.bind(this)}
                    handleMulti={this.handleMultiSelect.bind(this)}
                    handleDate={this.handleDate.bind(this)}
                />

                <div className='row'>
                    <div className='col-md-12'>
                        <div className='col-sm-6 text-center'>
                            <button className='btn btn-warning' onClick={this.back.bind(this)}><span style={paddingRight} className='glyphicon glyphicon-arrow-left'></span>Previous</button>
                        </div>
                        <div className='col-sm-6 text-center'>
                            <button disabled={!isEnabled} className='btn btn-success' onClick={this.post.bind(this)}>Next<span style={paddingLeft} className='glyphicon glyphicon-arrow-right'></span></button>
                        </div>
                    </div>
                </div>
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