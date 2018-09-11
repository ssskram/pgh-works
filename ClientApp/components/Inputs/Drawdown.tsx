
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Table from 'react-table'
import * as Funds from '../../store/GETS/funds'
import * as Drawdowns from '../../store/drawdowns'
import Input from '../FormElements/input'
import Currency from '../FormElements/numbers'
import Select from '../FormElements/select'
import { Helmet } from "react-helmet"
import { max } from 'moment';

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

let types = [] as any
let contractorVendors = [] as any

export class ProgramFundInputs extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            maxDrawdown: 0,
            projectDrawdowns: [],
            funds: props.funds,
            fundSearch: '',
            fundName: '',
            fundYear: '',
            fundType: '',

            // drawdown state
            parentID: props.parentID,
            parentType: props.parentType,
            fundID: '',
            drawdownAmount: '',
            drawdownType: '',
            contractorVendor: ''
        }
    }

    componentDidMount() {
        let allFunds = this.props.funds
        let projectID = this.props.projectID
        if (this.props.parentType == 'Phase') {
            const projectDrawdowns = this.props.drawdowns.filter(function (drawdown) {
                return (drawdown.parentID == projectID) && (drawdown.parentType == 'Project')
            })
            // set available list of funds derived from project drawdown
            let funds = [] as any
            projectDrawdowns.forEach(function (drawdown) {
                const fund = allFunds.find(function (fund) {
                    return fund.fundID == drawdown.fundID
                })
                funds.push(fund)
            })
            this.setState ({
                projectDrawdowns: projectDrawdowns,
                funds: funds
            })
        } else {
            types = []
            types = [
                { value: 'Pre-encumbered', label: 'Pre-encumbered', name: 'drawdownType' },
                { value: 'Encumbered', label: 'Encumbered', name: 'drawdownType' },
                { value: 'Spent', label: 'Spent', name: 'drawdownType' }
            ]
            contractorVendors = []
            contractorVendors = [
                { value: 'Contractor A', label: 'Contractor A', name: 'contractorVendor' },
                { value: 'Contractor B', label: 'Contractor B', name: 'contractorVendor' },
                { value: 'Contractor C', label: 'Contractor C', name: 'contractorVendor' },
                { value: 'Contractor D', label: 'Contractor D', name: 'contractorVendor' },
                { value: 'Contractor E', label: 'Contractor E', name: 'contractorVendor' },
                { value: 'Contractor F', label: 'Contractor F', name: 'contractorVendor' },
            ]
        }

    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
        if (event.target.name == 'fundSearch') {
            this.filterFunds(event.target.value)
        }
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    handleCurrency(event, maskedvalue, floatvalue) {
        this.setState({
            drawdownAmount: floatvalue
        }, function (this) {
            if (this.state.maxDrawdown > 0 && this.state.drawdownAmount > this.state.maxDrawdown) {
                alert('You cannot exceed the project-level drawdown of this fund: $' + this.state.maxDrawdown)
                this.setState ({ drawdownAmount: '' })
            }
        })
    }

    selectFund(fundID) {
        let fund = this.props.funds.find(function (item) {
            return item.fundID == fundID
        })
        this.setState({
            fundID: fundID,
            fundName: fund.fundName,
            fundType: fund.fundType,
            fundYear: fund.fundYear
        })
        if (this.props.parentType == 'Phase') {
            types = []
            contractorVendors = []
            let maxDrawdown = 0
            let projectFundDrawdowns = this.state.projectDrawdowns.filter(function (item) {
                return item.fundID == fundID
            })
            projectFundDrawdowns.forEach(function (drawdown) {
                const ts = { value: drawdown.drawdownType, label: drawdown.drawdownType, name: 'drawdownType' }
                types.push(ts)
                if (drawdown.contractorVendor) {
                    const cv =  { value: drawdown.contractorVendor, label: drawdown.contractorVendor, name: 'contractorVendor' }
                    contractorVendors.push(cv)
                }
                maxDrawdown = maxDrawdown + drawdown.drawdownAmount
            })
            this.setState ({
                maxDrawdown: maxDrawdown
            })
        }
    }

    filterFunds(input) {
        if (input == '' || input == null) {
            this.setState({
                funds: this.props.funds
            })
        } else {
            let search = input.toLowerCase()
            let filtered = this.props.funds.filter(function (item) {
                if (!item.fundName.toLowerCase().includes(search)) {
                    return false
                }
                return true
            })
            this.setState({
                funds: filtered
            })
        }
    }

    back() {
        this.setState({
            fundID: ''
        })
    }

    post() {
        const drawdown = {
            parentID: this.state.parentID,
            parentType: this.state.parentType,
            fundID: this.state.fundID,
            drawdownAmount: this.state.drawdownAmount,
            drawdownType: this.state.drawdownType,
            contractorVendor: this.state.contractorVendor
        }
        this.props.addDrawdown(drawdown)
        this.props.closeModal()
    }

    public render() {
        const {
            funds,
            fundSearch,
            fundName,
            fundYear,
            fundType,
            fundID,
            drawdownAmount,
            drawdownType,
            contractorVendor,
        } = this.state

        const {
            drawdowns
        } = this.props

        // validation
        const isEnabled =
            drawdownAmount != '' &&
            drawdownType != ''

        const columns = [{
            Header: 'Fund/Program',
            accessor: 'fundName'
        }, {
            Header: 'Year',
            accessor: 'fundYear',
        }, {
            Header: 'Type',
            accessor: 'fundType',
        }, {
            Header: '',
            accessor: 'fundID',
            Cell: props => <button onClick={() => this.selectFund(props.value)} className='btn btn-success'><span className='glyphicon glyphicon-ok'></span></button>,
            maxWidth: 75
        }]

        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                {fundID == '' &&
                    <div className='col-md-12'>
                        <br />
                        <h3>Select a program or fund</h3>
                        <hr />
                        <div className='col-md-12'>
                            <Input
                                value={fundSearch}
                                name="fundSearch"
                                header="Search by name"
                                placeholder="Enter a program/fund name"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>
                        <Table
                            data={funds}
                            columns={columns}
                            loading={false}
                            minRows={0}
                            pageSize={10}
                            showPageJump={false}
                            showPagination={true}
                            showPageSizeOptions={false}
                            noDataText=''
                            getTdProps={() => ({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    fontSize: '16px'
                                }
                            })}
                        />
                    </div>
                }
                {fundID != '' &&
                    <div className='col-md-12'>
                        <br />
                        <h2>Drawdown</h2>
                        <h4>Fund: <b>{fundName}</b></h4>
                        <h4>Fund type: <b>{fundType}</b></h4>
                        <h4>Fund year: <b>{fundYear}</b></h4>
                        <hr />
                        <div className='col-md-12'>
                            <Select
                                value={drawdownType}
                                name="drawdownType"
                                header='Drawdown type'
                                placeholder='Select type'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={types}
                            />
                        </div>
                        <div className='col-md-12'>
                            <Currency
                                value={drawdownAmount}
                                name="drawdownAmount"
                                header="Drawdown amount"
                                placeholder="Enter an amount"
                                prefix="$"
                                callback={this.handleCurrency.bind(this)}
                            />
                        </div>
                        <div className='col-md-12'>
                            <Select
                                value={contractorVendor}
                                name="contractorVendor"
                                header='Contractor or vendor'
                                placeholder='Select contractor or vendor'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={contractorVendors}
                            />
                        </div>
                        <div className='col-md-12 text-center'>
                            <div className='col-md-6'>
                                <button onClick={this.back.bind(this)} className='btn btn-warning'>Back</button>
                            </div>
                            <div className='col-md-6'>
                                <button disabled={!isEnabled} onClick={this.post.bind(this)} className='btn btn-success'>Save</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.funds,
        ...state.drawdowns
    }),
    ({
        ...Funds.actionCreators,
        ...Drawdowns.actionCreators
    })
)(ProgramFundInputs as any) as typeof ProgramFundInputs