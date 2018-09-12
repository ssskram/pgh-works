
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Datepicker from '../FormElements/datepicker'
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import * as moment from 'moment'
import Modal from 'react-responsive-modal'
import * as Projects from '../../store/projects'

const btnStyle = {
    fontSize: '25px',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: '8px'
}

const types = [
    { value: 'Programming', label: 'Programming', name: 'phaseType' },
    { value: 'Design', label: 'Design', name: 'phaseType' },
    { value: 'Construction', label: 'Construction', name: 'phaseType' },
    { value: 'Multi-faceted', label: 'Multi-faceted', name: 'phaseType' }
]

const statuses = [
    { value: 'In progress', label: 'In progress', name: 'projectStatus' },
    { value: 'Mobilizing', label: 'Mobilizing', name: 'projectStatus' },
    { value: 'Complete', label: 'Complete', name: 'projectStatus' }
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
            phaseType: '',
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
            phaseType,
            phaseStatus,
            projectName
        } = this.state
        return (
            <div>
                <button onClick={this.openModal.bind(this)} style={btnStyle}><span className='hidden-md hidden-lg hidden-xl glyphicon glyphicon-search'></span><span className='hidden-sm hidden-xs'>Filter phases</span></button>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <div>
                        <h2>Filter phases</h2>
                        <hr />
                        <div className='col-md-12'>
                            <Input
                                value={phaseName}
                                name="phaseName"
                                header="Phase name"
                                placeholder="Enter a name"
                                callback={this.handleChildChange.bind(this)}
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

                        <div className='col-md-12'>
                            <Select
                                value={phaseType}
                                name="phaseType"
                                header='Phase type'
                                placeholder='Select type'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={types}
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