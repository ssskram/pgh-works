
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Funds from '../../store/GETS/funds'
import Table from 'react-table'
import FundFilter from '../Filters/FundFilter'
import * as CurrencyFormat from 'react-currency-format'

const iconStyle = {
    color: '#fff',
    marginTop: '-5px',
    paddingRight: '15px',
    paddingLeft: '15px'
}

export class ProgramsFunds extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            funds: props.funds,
            selectedFundID: '',
            redirect: false
        }
    }

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    viewFund(fund) {
        this.setState({
            selectedFundID: fund.fundID,
            redirect: true
        })
    }

    public render() {
        const {
            funds,
            redirect,
            selectedFundID
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
            Header: 'Exp.',
            accessor: 'expirationDate',
        }, {
            Header: 'Original Amount',
            accessor: 'fundAmount',
            Cell: props => <CurrencyFormat value={props.value} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={value => <div>{value}</div>} />
        }, {
            Header: '',
            accessor: 'fundID',
            Cell: props => <button onClick={() => this.viewFund(props.original)} className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></button>,
            maxWidth: 100
        }]

        let redirectLink = "/Fund/id=" + selectedFundID
        if (redirect) {
            return <Redirect to={redirectLink} />
        }

        return (
            <div>
                <h2>Programs & Funds <span style={{ marginTop: '-5px' }} className='pull-right'><FundFilter /></span></h2>
                <hr />
                {funds.length > 0 &&
                    <Table
                        data={funds}
                        columns={columns}
                        loading={false}
                        minRows={0}
                        pageSize={50}
                        showPageJump={false}
                        showPagination={funds.length > 50}
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
                }
                {funds.length == 0 &&
                    <div className='col-md-12 text-center'>
                        <br />
                        <h1><span><img style={iconStyle} src='./images/nothing.png' /></span></h1>
                        <h2><i>Nothing to see here</i></h2>
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.funds
    }),
    ({
        ...Ping.actionCreators,
        ...Funds.actionCreators
    })
)(ProgramsFunds as any) as typeof ProgramsFunds