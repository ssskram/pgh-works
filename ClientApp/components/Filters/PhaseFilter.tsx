
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Datepicker from '../FormElements/datepicker'
import Select from '../FormElements/select'
import * as moment from 'moment'
import Modal from 'react-responsive-modal'
import * as Projects from '../../store/projects'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

const btnStyle = {
    fontSize: '25px',
    border: '1px solid rgb(44, 62, 80)'
}

const types = [
    { value: 'Programming', label: 'Programming', name: 'phaseName' },
    { value: 'Design', label: 'Design', name: 'phaseName' },
    { value: 'Construction', label: 'Construction', name: 'phaseName' },
    { value: 'Multi-faceted', label: 'Multi-faceted', name: 'phaseName' }
]

const statuses = [
    { value: 'In progress', label: 'In progress', name: 'phaseStatus' },
    { value: 'On hold', label: 'On hold', name: 'phaseStatus' },
    { value: 'Complete', label: 'Complete', name: 'phaseStatus' }
]

let projects = [] as any

export class PhaseFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            modalIsOpen: false,
            phaseName: '',
            startDate: '',
            endDate: '',
            phaseStatus: '',
            projectName: ''
        }
    }

    componentDidMount() {
        projects = []
        this.props.projects.forEach(function (project) {
            let json = { "value": project.projectName, "label": project.projectName, "name": 'projectName' }
            projects.push(json)
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
        this.setState({
            modalIsOpen: false
        })
    }

    public render() {
        const {
            modalIsOpen,
            phaseName,
            startDate,
            endDate,
            phaseStatus,
            projectName
        } = this.state
        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
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
                            <Select
                                value={phaseName}
                                name="phaseName"
                                header='Phase name'
                                placeholder='Select phase'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={types}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Select
                                value={projectName}
                                name="projectName"
                                header='Project name'
                                placeholder='Select project'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={projects}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Select
                                value={phaseStatus}
                                name="phaseStatus"
                                header='Phase status'
                                placeholder='Select status'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={statuses}
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

export default connect(
    (state: ApplicationState) => ({
        ...state.projects,
    }),
    ({
        ...Projects.actionCreators,
    })
)(PhaseFilter as any) as typeof PhaseFilter