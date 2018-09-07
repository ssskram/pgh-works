
import * as React from 'react'
import Datepicker from '../FormElements/datepicker'
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import * as moment from 'moment'

const departments = [
    { value: 'DOMI', label: 'DOMI', name: 'projectDepartment' },
    { value: 'DPW', label: 'DPW', name: 'projectDepartment' }
]
const statuses = [
    { value: 'In progress', label: 'In progress', name: 'projectStatus' },
    { value: 'Mobilizing', label: 'Mobilizing', name: 'projectStatus' },
    { value: 'Complete', label: 'Complete', name: 'projectStatus' }
]

export default class ProjectFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            projectName: '',
            startDate: '',
            endDate: '',
            projectDepartment: '',
            projectStatus: ''
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
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

    public render() {
        const {
            projectName,
            startDate,
            endDate,
            projectDepartment,
            projectStatus,
        } = this.state
        return (
            <div>
                <div className='col-md-12'>
                    <Input
                        value={projectName}
                        name="projectName"
                        header="Project name"
                        placeholder="Enter a name"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>

                <div className='col-md-12'>
                    <Select
                        value={projectStatus}
                        name="projectStatus"
                        header='Project status'
                        placeholder='Select status'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        options={statuses}
                    />
                </div>

                <div className='col-md-12'>
                    <Select
                        value={projectDepartment}
                        name="projectDepartment"
                        header='Project department'
                        placeholder='Select department'
                        onChange={this.handleChildSelect.bind(this)}
                        multi={false}
                        options={departments}
                    />
                </div>

                <div className='col-md-6'>
                    <Datepicker
                        value={startDate}
                        name="startDate"
                        header="From"
                        placeholder="Select a date"
                        callback={(value) => this.handleDate(value, 'expectedStartDate')}
                    />
                </div>

                <div className='col-md-6'>
                    <Datepicker
                        value={endDate}
                        name="endDate"
                        header="To"
                        placeholder="Select a date"
                        callback={(value) => this.handleDate(value, 'expectedEndDate')}
                    />
                </div>

                <div className='col-md-12 text-center'>
                    <button className='btn btn-success'>Apply filter</button>
                </div>
            </div>
        )
    }
}