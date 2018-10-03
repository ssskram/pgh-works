
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as Personnel from '../../../store/GETS/personnel'
import Input from '../../FormElements/input'
import TextArea from '../../FormElements/textarea'
import Select from '../../FormElements/select'
import Datepicker from '../../FormElements/datepicker'
import Currency from '../../FormElements/numbers'

const statuses = [
    { value: 'Programming', label: 'Programming', name: 'projectStatus' },
    { value: 'Design', label: 'Design', name: 'projectStatus' },
    { value: 'Construction', label: 'Construction', name: 'projectStatus' },
    { value: 'Complete', label: 'Complete', name: 'projectStatus' },
]

const departments = [
    { value: 'DOMI', label: 'DOMI', name: 'projectDepartment' },
    { value: 'DPW', label: 'DPW', name: 'projectDepartment' }
]

const sectionHeader = {
    marginLeft: '30px',
    letterSpacing: '2px',
    fontWeight: 600 as any
}

const dateStyle = {
    backgroundColor: 'rgba(92, 184, 92, .05)',
    padding: '10px',
    borderRadius: '10px',
    margin: '20px 0px'
}

const ownerStyle = {
    backgroundColor: 'rgba(34, 41, 107, .05)',
    padding: '10px',
    borderRadius: '10px',
    margin: '20px 0px'
}

const glyphs = {
    marginRight: '25px',
    fontSize: '30px'
}

export class ProjectInputs extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            personnel: []
        }
        this.handleDate = this.handleDate.bind(this)
    }

    componentDidMount() {
        const personnel = [] as any
        this.props.personnel.forEach(user => {
            const personnelSelect = { value: user.title, label: user.title, name: 'projectManager' }
            personnel.push(personnelSelect)
        })
        this.setState({
            personnel: personnel
        })
    }

    handleChildChange(event) {
        this.props.handleInput(event)
    }

    handleChildSelect(event) {
        this.props.handleSelect(event)
    }

    handleMembersMulti(value) {
        this.props.handleMulti("projectMembers", value)
    }

    handleDate(date, name) {
        this.props.handleDate(date, name)
    }

    handleCurrency(event, maskedvalue, floatvalue) {
        this.props.handleCurrency(floatvalue)
    }

    public render() {
        const {
            projectName,
            expectedStartDate,
            expectedEndDate,
            actualStartDate,
            actualEndDate,
            projectManager,
            projectMembers,
            projectDepartment,
            projectDescription,
            projectStatus,
            projectBudget,
            notes,
            update
        } = this.props.description

        const {
            personnel
        } = this.state
        return (
            <div style={{ padding: '10px' }}>
                {!update &&
                    <div className='col-md-12'>
                        <Input
                            value={projectName}
                            name="projectName"
                            required={true}
                            header="Project name"
                            placeholder="Enter a name"
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                }

                <div className='col-md-12'>
                    <Select
                        value={projectStatus}
                        name="projectStatus"
                        header='Project status'
                        placeholder='Select status(es)'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        required={true}
                        options={statuses}
                    />
                </div>

                <div className='col-md-12'>
                    <Currency
                        value={projectBudget}
                        name="projectBudget"
                        header="Project budget"
                        required={false}
                        placeholder="Enter an amount"
                        prefix="$"
                        callback={this.handleCurrency.bind(this)}
                    />
                </div>

                <div className='col-md-6'>
                    <TextArea
                        value={projectDescription}
                        name="projectDescription"
                        header="Project description"
                        placeholder="Provide a brief explanation of the project"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-6'>
                    <TextArea
                        value={notes}
                        name="notes"
                        header="Notes"
                        placeholder="Enter any other relevant information"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div style={dateStyle} className='col-md-12'>
                    <h3 style={sectionHeader}>Duration<span style={glyphs} className='glyphicon glyphicon-calendar hidden-sm hidden-xs pull-right'></span></h3>
                    {!update &&
                        <div>
                            <div className='col-md-6'>
                                <Datepicker
                                    value={expectedStartDate}
                                    name="expectedStartDate"
                                    header="Expected start date"
                                    required={true}
                                    placeholder="Select a date"
                                    callback={(value) => this.handleDate(value, 'expectedStartDate')}
                                />
                            </div>

                            <div className='col-md-6'>
                                <Datepicker
                                    value={expectedEndDate}
                                    name="expectedEndDate"
                                    header="Expected end date"
                                    required={true}
                                    placeholder="Select a date"
                                    callback={(value) => this.handleDate(value, 'expectedEndDate')}
                                />
                            </div>

                        </div>
                    }

                    <div className='col-md-6'>
                        <Datepicker
                            value={actualStartDate}
                            name="actualStartDate"
                            header="Actual start date"
                            placeholder="Select a date"
                            callback={(value) => this.handleDate(value, 'actualStartDate')}
                        />
                    </div>

                    <div className='col-md-6'>
                        <Datepicker
                            value={actualEndDate}
                            name="actualEndDate"
                            header="Actual end date"
                            placeholder="Select a date"
                            callback={(value) => this.handleDate(value, 'actualEndDate')}
                        />
                    </div>
                </div>

                <div className='col-md-12' style={ownerStyle}>
                    <h3 style={sectionHeader}>Owners<span style={glyphs} className='glyphicon glyphicon-user hidden-sm hidden-xs pull-right'></span></h3>
                    <div className='col-md-12'>
                        <Select
                            value={projectDepartment}
                            name="projectDepartment"
                            required={true}
                            header='Department'
                            placeholder='Select a department'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={departments}
                        />
                    </div>

                    <div className='col-md-12'>
                        <Select
                            value={projectManager}
                            name="projectManager"
                            header='Project manager'
                            required={true}
                            placeholder='Select manager'
                            onChange={this.handleChildSelect.bind(this)}
                            multi={false}
                            options={personnel}
                        />
                    </div>

                    <div className='col-md-12'>
                        <Select
                            value={projectMembers}
                            name="projectMembers"
                            header='Project members'
                            placeholder='Select team members'
                            onChange={this.handleMembersMulti.bind(this)}
                            multi={true}
                            options={personnel}
                            delimiter='; '
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.personnel
    }),
    ({
        ...Personnel.actionCreators
    })
)(ProjectInputs as any) as typeof ProjectInputs