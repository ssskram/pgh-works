
// project input/update form
// parent of ProjectFields.tsx

import * as React from 'react'
import ProjectFields from './../ProjectFields'
import * as moment from 'moment'

const paddingLeft = {
    paddingLeft: '25px'
}

const paddingRight = {
    paddingRight: '25px'
}

export default class ProjectDescription extends React.Component<any, any> {
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
            notes: '',
            throwNameError: false
        }
    }

    handleChildChange(event) {
        if (event.target.name == 'projectName') {
            if (!this.props.projects.some(project => project.projectName.toLowerCase() == event.target.value.toLowerCase())) {
                this.setState({
                    projectName: event.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
                    throwNameError: false
                })
            } else {
                this.setState({
                    projectName: event.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''),
                    throwNameError: true
                })
            }
        } else {
            this.setState({
                [event.target.name]: event.target.value
            });

        }
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
            projectStatus,
            projectDepartment,
            throwNameError
        } = this.state

        // validation
        const isEnabled =
            projectName != '' &&
            expectedStartDate != '' &&
            expectedEndDate != '' &&
            projectManager != '' &&
            projectStatus != '' &&
            projectDepartment != '' &&
            throwNameError == false

        return (
            <div>
                {throwNameError == true &&
                    <div className='alert alert-danger text-center'>
                        <span style={{fontSize: '1.5em'}}>Sorry!</span><br/>
                        A project with that name already exists<br/>
                        Please include additional, unique information in the name
                    </div>
                }
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