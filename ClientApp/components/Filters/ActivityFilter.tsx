
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import Modal from 'react-responsive-modal'
import * as Activity from '../../store/activity'
import filterActivity from './../../functions/filters/filterActivity'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

export class ActivityFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            onFilter: false,
            modalIsOpen: false,
            parent: '',
            user: '',
            date: ''
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

    filter() {
        const filterLoad = {
            parent: this.state.parent,
            user: this.state.user,
            date: this.state.date
        }
        this.props.returnFiltered(filterActivity(this.props.activity, filterLoad))
        this.setState({
            modalIsOpen: false,
            onFilter: true
        })
    }

    clearFilter() {
        this.props.returnFiltered(this.props.activity)
        this.setState({
            onFilter: false,
            parent: '',
            user: '',
            date: ''
        })
    }

    public render() {
        const {
            onFilter,
            modalIsOpen,
            parent,
            user,
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
                            <Input
                                value={parent}
                                name="parent"
                                header="Project name"
                                placeholder="Select..."
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Input
                                value={user}
                                name="user"
                                header="Created by"
                                placeholder="Select a colleague..."
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Input
                                value={date}
                                name="date"
                                header="Submitted"
                                placeholder="Select a date...."
                                callback={this.handleChildChange.bind(this)}
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
        ...state.activity,
    }),
    ({
        ...Activity.actionCreators,
    })
)(ActivityFilter as any) as typeof ActivityFilter