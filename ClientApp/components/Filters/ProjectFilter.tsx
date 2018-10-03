
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Personnel from '../../store/GETS/personnel'
import * as User from '../../store/GETS/user'
import * as Projects from '../../store/projects'
import Datepicker from '../FormElements/datepicker'
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import * as moment from 'moment'
import Modal from 'react-responsive-modal'
import { Helmet } from "react-helmet"
import filterProjects from './../../functions/filterProjects'
import getMyProjects from './../../functions/myProjects'

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

const btnStyle = {
    fontSize: '25px'
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

export class ProjectFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            onFilter: false,
            personnel: [],
            modalIsOpen: false,
            projectName: '',
            startDate: '',
            endDate: '',
            projectDepartment: '',
            projectStatus: '',
            projectManager: ''
        }
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

    filter() {
        let projects = [] as any
        if (this.props.filterType == 'all') {
            projects = this.props.projects
        } else {
            const personnel = this.props.personnel
            const user = this.props.user
            projects = getMyProjects(this.props.projects, personnel, user)
        }
        const filterLoad = {
            projectName: this.state.projectName,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            projectDepartment: this.state.projectDepartment,
            projectStatus: this.state.projectStatus,
            projectManager: this.state.projectManager
        }
        this.props.returnFiltered(filterProjects(projects, filterLoad))
        this.setState({
            modalIsOpen: false,
            onFilter: true
        })
    }

    clearFilter () {
        this.props.returnFiltered(this.props.projects)
        this.setState({
            onFilter: false,
            projectName: '',
            startDate: '',
            endDate: '',
            projectDepartment: '',
            projectStatus: '',
            projectManager: ''
        })
    }

    public render() {
        const {
            onFilter,
            personnel,
            modalIsOpen,
            projectName,
            startDate,
            endDate,
            projectDepartment,
            projectStatus,
            projectManager
        } = this.state
        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                {onFilter == false &&
                    <button onClick={this.openModal.bind(this)} style={btnStyle} className='btn btn-secondary'>
                        <span style={{ padding: '3px' }} className='hidden-md hidden-lg hidden-xl glyphicon glyphicon-search'></span>
                        <span className='hidden-sm hidden-xs'>Filter</span>
                    </button>
                }
                {onFilter == true &&
                    <button onClick={this.clearFilter.bind(this)} style={btnStyle} className='btn btn-secondary'>
                        <span className='hidden-md hidden-lg hidden-xl glyphicon glyphicon-remove'></span>
                        <span className='hidden-sm hidden-xs'>Clear</span>
                    </button>
                }
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

                        <div className='col-md-12'>
                            <Select
                                value={projectManager}
                                name="projectManager"
                                header='Project manager'
                                placeholder='Select user'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={personnel}
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

export default connect(
    (state: ApplicationState) => ({
        ...state.personnel,
        ...state.projects,
        ...state.user
    }),
    ({
        ...Personnel.actionCreators,
        ...Projects.actionCreators,
        ...User.actionCreators
    })
)(ProjectFilter as any) as typeof ProjectFilter