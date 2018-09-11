
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Table from 'react-table'
import * as Funds from '../../store/GETS/funds'
import * as Drawdowns from '../../store/drawdowns'
import Input from '../FormElements/input'
import TextArea from '../FormElements/textarea'
import Select from '../FormElements/select'
import Datepicker from '../FormElements/datepicker'

const iconStyle = {
    color: '#fff',
    marginTop: '-5px',
    paddingRight: '15px',
    paddingLeft: '15px'
}

export class ProgramFundInputs extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            funds: props.funds,
            fundSearch: '',

            // drawdown state
            parentID: props.parentID,
            parentType: props.parentType,
            fundID: '',
            drawdownAmount: '',
            drawdownType: '',
            contractorVendor: ''
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

    selectFund(fundID) {
        console.log(fundID)
        this.setState({
            fundID: fundID
        })
    }

    filterFunds (input) {
        if (input == '' || input == null) {
            this.setState ({
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
            this.setState ({
                funds: filtered
            })
        }
    }

    public render() {
        const {
            funds,
            fundSearch,
            parentID,
            parentType,
            fundID,
            drawdownAmount,
            drawdownType,
            contractorVendor,
        } = this.state

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
                        <h4>form fields here</h4>
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