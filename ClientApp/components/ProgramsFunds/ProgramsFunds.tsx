
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Funds from '../../store/GETS/funds'
import Table from 'react-table'

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
        }, {
            Header: '',
            accessor: 'fundID',
            Cell: props => <button onClick={() => this.viewFund(props.original)} className='btn btn-success'><span className='glyphicon glyphicon-eye-open'></span></button>,
            maxWidth: 100
        }]

        let redirectLink= "/Fund/id=" + selectedFundID
        if (redirect) {
            return <Redirect to={redirectLink} />
        }

        return (
            <div>
                <h2>Programs & Funds</h2>
                <hr />
                {funds.length > 0 &&
                    <Table
                        data={funds}
                        columns={columns}
                        loading={false}
                        minRows={0}
                        pageSize={50}
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