
// generates a record in the drawdown store 
// that corresponds to an existing program or fund
// stored in the system

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Table from 'react-table'
import * as Funds from '../../store/GETS/funds'
import * as Drawdowns from '../../store/drawdowns'
import * as Phases from '../../store/phases'
import Input from '../FormElements/input'
import TextArea from '../FormElements/textarea'
import Currency from '../FormElements/numbers'
import Select from '../FormElements/select'
import { Helmet } from "react-helmet"
import { v1 as uuid } from 'uuid'
import * as CurrencyFormat from 'react-currency-format'

const dropdownStyle = '.Select-menu-outer { overflow: visible}'

let types = [] as any

export class ProgramFundInputs extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            funds: props.funds,
            fundSearch: '',
            fundName: '',
            fundYear: '',
            fundType: '',

            // drawdown state
            drawdownID: '',
            parentID: props.parentID,
            parentType: props.parentType,
            fundID: '',
            drawdownAmount: '',
            drawdownType: '',
            notes: ''
        }
    }

    componentDidMount() {
        let allFunds = this.props.funds
        if (this.props.edit) {
            const fund = allFunds.find(fund => {
                return fund.fundID == this.props.drawdown.fundID
            })
            this.setState({
                fundName: fund.fundName,
                fundYear: fund.fundYear,
                fundType: fund.fundType,
                fundID: fund.fundID,
                drawdownID: this.props.drawdown.drawdownID,
                drawdownAmount: this.props.drawdown.drawdownAmount,
                drawdownType: this.props.drawdown.drawdownType,
                notes: this.props.drawdown.notes
            })
        } else {
            const guid: string = uuid()
            this.setState({
                drawdownID: guid
            })
        }
        types = []
        types = [
            { value: 'Pre-encumbered', label: 'Pre-encumbered', name: 'drawdownType' },
            { value: 'Encumbered', label: 'Encumbered', name: 'drawdownType' },
            { value: 'Spent', label: 'Spent', name: 'drawdownType' }
        ]
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
        if (event.target.name == 'fundSearch') {
            this.filterFunds(event.target.value)
        }
    }

    handleChildSelect(event) {
        this.setState({
            [event.name]: event.value
        })
    }

    handleCurrency(event, maskedvalue, floatvalue) {
        this.setState({
            drawdownAmount: floatvalue
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
            drawdownID: this.state.drawdownID,
            parentID: this.state.parentID,
            parentType: this.state.parentType,
            fundID: this.state.fundID,
            drawdownAmount: this.state.drawdownAmount,
            drawdownType: this.state.drawdownType,
            notes: this.state.notes
        }
        this.props.addDrawdown(drawdown)
        this.props.closeModal()
    }

    update() {
        const drawdown = {
            drawdownID: this.state.drawdownID,
            parentID: this.state.parentID,
            parentType: this.state.parentType,
            fundID: this.state.fundID,
            drawdownAmount: this.state.drawdownAmount,
            drawdownType: this.state.drawdownType,
            notes: this.state.notes
        }
        this.props.updateDrawdown(drawdown)
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
            notes
        } = this.state

        const {
            parentType,
            edit
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
                        {funds.length > 0 &&
                            <div>
                                <div className='col-md-12'>
                                    <Input
                                        value={fundSearch}
                                        name="fundSearch"
                                        header=""
                                        placeholder="Search by name"
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
                                    showPagination={funds.length > 10}
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
                        {edit &&
                            <div>
                                <h4>Amount: <b><CurrencyFormat value={drawdownAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></h4>
                                {notes != '' &&
                                    <h4><i>"{notes}"</i></h4>
                                }
                            </div>
                        }
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
                        {!edit && parentType == 'Project' &&
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
                        {!edit && parentType == 'Project' &&
                            <div className='col-md-12'>
                                <TextArea
                                    value={notes}
                                    name="notes"
                                    header="Notes"
                                    placeholder="Relevant information"
                                    callback={this.handleChildChange.bind(this)}
                                />
                            </div>
                        }
                        {!edit &&
                            <div className='col-md-12 text-center'>
                                <div className='col-md-6'>
                                    <button onClick={this.back.bind(this)} className='btn btn-warning'>Back</button>
                                </div>
                                <div className='col-md-6'>
                                    <button disabled={!isEnabled} onClick={this.post.bind(this)} className='btn btn-success'>Save</button>
                                </div>
                            </div>
                        }
                        {edit &&
                            <div className='col-md-12 text-center'>
                                <div className='col-md-12'>
                                    <button disabled={!isEnabled} onClick={this.update.bind(this)} className='btn btn-success'>Update</button>
                                </div>
                            </div>
                        }
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