
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import ProjectFields from '../../Inputs/Project'
import * as moment from 'moment'
import { bindActionCreators } from 'redux';

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

    handleMultiSelect(field, value) {
        this.setState({ [field]: value })
    }

    handleActualCost (value) {
        this.setState({ actualCost: value })
    }

    handleExpectedCost (value) {
        this.setState({ expectedCost: value })
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

    post() {
        this.props.post(this.state)
    }

    back() {
        this.props.back()
    }

    public render() {
        const {
            projectName,
            startDate,
            endDate,
            projectManager,
            projectStatus
        } = this.state

        // validation
        const isEnabled =
            projectName != '' &&
            startDate != '' &&
            endDate != '' &&
            projectManager != '' &&
            projectStatus != ''

        return (
            <div>
                <ProjectFields
                    description={this.state}
                    handleInput={this.handleChildChange.bind(this)}
                    handleSelect={this.handleChildSelect.bind(this)}
                    handleMulti={this.handleMultiSelect.bind(this)}
                    handleStartDate={this.handleStartDate.bind(this)}
                    handleEndDate={this.handleEndDate.bind(this)}
                    handleExpectedCost={this.handleExpectedCost.bind(this)}
                    handleActualCost={this.handleActualCost.bind(this)}
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