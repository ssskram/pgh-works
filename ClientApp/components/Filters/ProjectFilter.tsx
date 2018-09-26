
import * as React from 'react'
import Datepicker from '../FormElements/datepicker'
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import * as moment from 'moment'
import Modal from 'react-responsive-modal'

const btnStyle = {
    fontSize: '25px',
    border: '1px solid rgb(44, 62, 80)'
}

const departments = [
    { value: 'DOMI', label: 'DOMI', name: 'projectDepartment' },
    { value: 'DPW', label: 'DPW', name: 'projectDepartment' }
]

const statuses = [
    { value: 'Programming', label: 'Programming', name: 'projectStatus' },
    { value: 'Design', label: 'Design', name: 'projectStatus' },
    { value: 'Construction', label: 'Construction', name: 'projectStatus' },
    { value: 'Complete', label: 'Complete', name: 'projectStatus' },
]

export default class ProjectFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            modalIsOpen: false,
            projectName: '',
            startDate: '',
            endDate: '',
            projectDepartment: '',
            projectStatus: ''
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        })
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

    filter () {
        this.setState ({
            modalIsOpen: false
        })
    }

    public render() {
        const {
            modalIsOpen,
            projectName,
            startDate,
            endDate,
            projectDepartment,
            projectStatus,
        } = this.state
        return (
            <div>
                <button onClick={this.openModal.bind(this)} style={btnStyle} className='btn btn-secondary'><span className='hidden-md hidden-lg hidden-xl glyphicon glyphicon-search'></span><span className='hidden-sm hidden-xs'>Filter</span></button>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
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
                                callback={(value) => this.handleDate(value, 'startDate')}
                            />
                        </div>

                        <div className='col-md-6'>
                            <Datepicker
                                value={endDate}
                                name="endDate"
                                header="To"
                                placeholder="Select a date"
                                callback={(value) => this.handleDate(value, 'endDate')}
                            />
                        </div>

                        <div className='col-md-12 text-center'>
                            <button onClick={this.filter.bind(this)} className='btn btn-success'>Apply filter</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}