
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Personnel from '../../store/GETS/personnel'
import * as Projects from '../../store/projects'
import Select from '../FormElements/select'
import Datepicker from '../FormElements/datepicker'
import Modal from 'react-responsive-modal'
import * as moment from 'moment'
import * as Activity from '../../store/activity'
import filterActivity from './../../functions/filters/filterActivity'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

export class ActivityFilter extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            onFilter: false,
            modalIsOpen: false,
            project: '',
            projects: [],
            user: '',
            users: [],
            date: ''
        }
    }

    componentDidMount() {
        this.setDropdowns()
    }

    componentWillReceiveProps() {
        this.setDropdowns()
    }

    setDropdowns() {
        const personnel = [] as any
        const projectDropdown = [] as any
        this.props.personnel.forEach(user => {
            const personnelSelect = { value: user.title, label: user.title, name: 'user' }
            personnel.push(personnelSelect)
        })
        this.props.projects.forEach(project => {
            const projectSelect = { value: project.projectName, label: project.projectName, name: 'project' }
            projectDropdown.push(projectSelect)
        })
        this.setState({
            users: personnel,
            projects: projectDropdown
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
        const filterLoad = {
            user: this.state.user,
            date: this.state.date,
            project: this.state.project,
        }
        this.props.returnFiltered(filterActivity(this.props.activity, this.props.projects, filterLoad))
        this.setState({
            modalIsOpen: false,
            onFilter: true
        })
    }

    clearFilter() {
        this.props.returnFiltered(this.props.activity)
        this.setState({
            onFilter: false,
            project: '',
            user: '',
            date: ''
        })
    }

    public render() {
        const {
            onFilter,
            modalIsOpen,
            project,
            projects,
            user,
            users,
            date
        } = this.state
        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                {onFilter == false &&
                    <button onClick={this.openModal.bind(this)} className='btn  btn-primary'>
                        <span style={{ padding: '3px' }} className='hidden-md hidden-lg hidden-xl glyphicon glyphicon-search'></span>
                        <span className='hidden-sm hidden-xs'>Filter</span>
                    </button>
                }
                {onFilter == true &&
                    <button onClick={this.clearFilter.bind(this)} className='btn  btn-primary'>
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
                            <Select
                                value={project}
                                name="project"
                                header="Project"
                                placeholder="Select project..."
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={projects}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Select
                                value={user}
                                name="user"
                                header="Created by"
                                placeholder="Select a colleague..."
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={users}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Datepicker
                                value={date}
                                name="date"
                                header="Submitted"
                                placeholder="Select a date...."
                                callback={(value) => this.handleDate(value, 'date')}
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
        ...state.activity
    }),
    ({
        ...Personnel.actionCreators,
        ...Projects.actionCreators,
        ...Activity.actionCreators
    })
)(ActivityFilter as any) as typeof ActivityFilter