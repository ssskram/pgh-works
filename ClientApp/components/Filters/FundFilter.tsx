
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Funds from '../../store/GETS/funds'
import Datepicker from '../FormElements/datepicker'
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import * as moment from 'moment'
import Modal from 'react-responsive-modal'
import filterFunds from './../../functions/filters/filterFunds'
import removeDuplicates from './../../functions/removeDuplicates'

const types = [
    { value: 'Bond', label: 'Bond', name: 'fundType' },
    { value: 'Paygo', label: 'Paygo', name: 'fundType' },
    { value: 'Operating', label: 'Operating', name: 'fundType' },
    { value: 'CDBG', label: 'CDBG', name: 'fundType' }
]

export class FundFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            funds: [],
            onFilter: false,
            modalIsOpen: false,
            fundName: '',
            fundYear: '',
            fundType: '',
            startDate: '',
            endDate: ''
        }
    }

    componentDidMount() {
        this.setDropdowns()
    }

    componentWillReceiveProps() {
        this.setDropdowns()
    }

    setDropdowns() {
        const funds = [] as any
        this.props.funds.forEach(fund => {
            const fundSelect = { value: fund.fundName, label: fund.fundName, name: 'fundName' }
            funds.push(fundSelect)
        })
        this.setState({
            funds: removeDuplicates(funds, "value")
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
        const filterLoad = {
            fundName: this.state.fundName,
            fundYear: this.state.fundYear,
            fundType: this.state.fundType,
            startDate: this.state.startDate,
            endDate: this.state.endDate
        }
        this.props.returnFiltered(filterFunds(this.props.funds, filterLoad))
        this.setState({
            onFilter: true,
            modalIsOpen: false
        })
    }

    clearFilter() {
        this.props.returnFiltered(this.props.funds)
        this.setState({
            onFilter: false,
            fundName: '',
            fundYear: '',
            fundType: '',
            startDate: '',
            endDate: ''
        })
    }

    public render() {
        const {
            onFilter,
            funds,
            modalIsOpen,
            fundName,
            fundYear,
            fundType,
            startDate,
            endDate
        } = this.state

        return (
            <div>
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
                                value={fundName}
                                name="fundName"
                                header='Fund/Program name'
                                placeholder='Select fund'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={funds}
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
                        <div>
                            <div className="col-md-12" style={{paddingLeft: '30px'}}>
                                <h4 className="form-h4">Expiration date</h4>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <Datepicker
                                value={startDate}
                                name="startDate"
                                placeholder="Select a start date"
                                callback={(value) => this.handleDate(value, 'startDate')}
                            />
                        </div>
                        <div className='col-md-6'>
                            <Datepicker
                                value={endDate}
                                name="endDate"
                                placeholder="Select an end date"
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
        ...state.funds
    }),
    ({
        ...Funds.actionCreators
    })
)(FundFilter as any) as typeof FundFilter