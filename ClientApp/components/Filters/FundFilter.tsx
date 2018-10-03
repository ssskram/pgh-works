
import * as React from 'react'
import Datepicker from '../FormElements/datepicker'
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import * as moment from 'moment'
import Modal from 'react-responsive-modal'

const btnStyle = {
    fontSize: '22px'
}

const types = [
    { value: 'Bond', label: 'Bond', name: 'fundType' },
    { value: 'Paygo', label: 'Paygo', name: 'fundType' },
    { value: 'Operating', label: 'Operating', name: 'fundType' },
    { value: 'CDBG', label: 'CDBG', name: 'fundType' }
]

export default class FundFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            modalIsOpen: false,
            fundName: '',
            fundYear: '',
            fundType: '',
            expirationDate: ''
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
            fundName,
            fundYear,
            fundType,
            expirationDate
        } = this.state

        return (
            <div>
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
                            <Input
                                value={fundName}
                                name="fundName"
                                header="Fund/Program name"
                                placeholder="Enter a name"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Input
                                value={fundYear}
                                name="fundYear"
                                header="Fund year"
                                placeholder="Enter a year"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Select
                                value={fundType}
                                name="fundType"
                                header='Fund type'
                                placeholder='Select type'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={types}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Datepicker
                                value={expirationDate}
                                name="expirationDate"
                                header="Expiration date"
                                placeholder="Select a date"
                                callback={(value) => this.handleDate(value, 'expirationDate')}
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
