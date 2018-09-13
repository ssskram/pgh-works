
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Table from 'react-table'
import * as Funds from '../../store/GETS/funds'
import * as Drawdowns from '../../store/drawdowns'
import * as Phases from '../../store/phases'
import Input from '../FormElements/input'
import Currency from '../FormElements/numbers'
import Select from '../FormElements/select'
import { Helmet } from "react-helmet"
import * as CurrencyFormat from 'react-currency-format'
import Tooltip from 'react-tooltip'

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

const tooltipStyle = {
    marginLeft: '20px',
    fontSize: '16px'
}

let types = [] as any
let contractorVendors = [] as any

export class ProgramFundInputs extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            amountRemaining: 0,
            maxDrawdown: 0,
            projectDrawdowns: [],
            expenditureTooltips: [],
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
            this.setState({
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
        if (this.props.parentType == 'Phase') {
            const fundID = this.state.fundID
            const allDrawdowns = this.props.drawdowns
            const projectID = this.props.projectID
            let sumSiblingDrawdowns = 0
            let expenditureTooltips = [] as any
            let siblingPhases = this.props.phases.filter(function (phase) {
                return phase.projectID == projectID
            })
            siblingPhases.forEach(function (phase) {
                const drawdowns = allDrawdowns.filter(function (drawdown) {
                    return drawdown.parentID == phase.phaseID && drawdown.parentType == 'Phase'
                })
                drawdowns.forEach(function (drawdown) {
                    if (drawdown.fundID == fundID && drawdown.drawdownType == event.value) {
                        sumSiblingDrawdowns = sumSiblingDrawdowns + drawdown.drawdownAmount
                        expenditureTooltips.push({ phaseName: phase.phaseName, drawdownAmount: drawdown.drawdownAmount })
                    }
                })
            })
            const amountRemaining = this.state.maxDrawdown - sumSiblingDrawdowns
            this.setState({
                [event.name]: event.value,
                amountRemaining: amountRemaining,
                expenditureTooltips: expenditureTooltips
            })
        } else {
            this.setState({
                [event.name]: event.value
            })
        }
    }

    handleCurrency(event, maskedvalue, floatvalue) {
        this.setState({
            drawdownAmount: floatvalue
        }, function (this) {
            if (this.state.amountRemaining > 0 && this.state.drawdownAmount > this.state.amountRemaining) {
                alert('You cannot exceed the remaining balance of this fund & drawdown type for this project: $' + this.state.amountRemaining)
                this.setState({ drawdownAmount: '' })
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
                    const cv = { value: drawdown.contractorVendor, label: drawdown.contractorVendor, name: 'contractorVendor' }
                    contractorVendors.push(cv)
                }
                maxDrawdown = maxDrawdown + drawdown.drawdownAmount
            })
            this.setState({
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
            maxDrawdown,
            expenditureTooltips,
            amountRemaining
        } = this.state

        const {
            parentType
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

        const siblingExpenditures = expenditureTooltips.map((item, index) => {
            return (
                <div key={index}><b>{item.phaseName}</b>: -<CurrencyFormat value={item.drawdownAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} /></div>
            );
        });

        const tooltip =
            <div className='col-md-12'>
                <div>
                    <b>Attributed to project:  </b><CurrencyFormat value={maxDrawdown} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                </div>
                {expenditureTooltips.length > 0 &&
                    <div>
                        <i>Sub other phases:</i>
                        {siblingExpenditures}
                    </div>
                }
            </div>

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
                        {funds.length > 0 &&
                            <div>
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
                                    showPagination={funds > 10}
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
                        {funds.length == 0 && this.props.parentType == 'Phase' &&
                            <div className='col-md-12 text-center'>
                                <div className='alert alert-info'><h3>Expenditures must be declared at the project level before being declared at the phase level</h3></div>
                            </div>
                        }
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
                                required={true}
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={types}
                            />
                        </div>
                        {parentType == 'Phase' && drawdownType != '' &&
                            <div className='col-md-12'>
                                <Currency
                                    value={drawdownAmount}
                                    name="drawdownAmount"
                                    header="Drawdown amount"
                                    required={true}
                                    placeholder="Enter an amount"
                                    prefix="$"
                                    callback={this.handleCurrency.bind(this)}
                                />
                                <a style={tooltipStyle} data-tip data-for='siblings'>Amount remaining: <b style={{ color: 'red' }}><CurrencyFormat value={amountRemaining} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></a>
                                <br />
                                <br />
                                <Tooltip id='siblings'>{tooltip}</Tooltip>
                            </div>
                        }
                        {parentType == 'Project' &&
                            <div className='col-md-12'>
                                <Currency
                                    value={drawdownAmount}
                                    name="drawdownAmount"
                                    header="Drawdown amount"
                                    required={true}
                                    placeholder="Enter an amount"
                                    prefix="$"
                                    callback={this.handleCurrency.bind(this)}
                                />
                            </div>
                        }
                        {parentType == 'Project' &&
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
                        }
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
        ...state.drawdowns,
        ...state.phases
    }),
    ({
        ...Funds.actionCreators,
        ...Drawdowns.actionCreators,
        ...Phases.actionCreators
    })
)(ProgramFundInputs as any) as typeof ProgramFundInputs