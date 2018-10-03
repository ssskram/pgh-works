
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Select from '../FormElements/select'
import Datepicker from '../FormElements/datepicker'
import Modal from 'react-responsive-modal'
import * as moment from 'moment'
import * as Tags from '../../store/tags'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

const btnStyle = {
    fontSize: '22px'
}

const types = [
    { value: 'Project', label: 'Project', name: 'parentType' },
    { value: 'Phase', label: 'Phase', name: 'parentType' },
]

export class TagFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            modalIsOpen: false,
            parentType: '',
            startDate: '',
            endDate: ''
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

    filter() {
        this.setState({
            modalIsOpen: false
        })
    }

    public render() {
        const {
            modalIsOpen,
            parentType,
            startDate,
            endDate
        } = this.state
        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                <button onClick={this.openModal.bind(this)} style={btnStyle} className='btn btn-secondary'>
                    <span style={{padding: '3px'}} className='hidden-md hidden-lg hidden-xl glyphicon glyphicon-search'></span>
                    <span className='hidden-sm hidden-xs'>Filter</span>
                </button>
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
                                value={parentType}
                                name="parentType"
                                header='Filter by type'
                                placeholder='Projects or phases'
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
        ...state.tags,
    }),
    ({
        ...Tags.actionCreators,
    })
)(TagFilter as any) as typeof TagFilter