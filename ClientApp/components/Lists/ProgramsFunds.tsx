
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ApplicationState } from '../../store'
import Hydrate from './../Utilities/HydrateStore'
import * as Ping from '../../store/GETS/ping'
import * as Funds from '../../store/GETS/funds'
import { returnPageNumber, returnCurrentItems } from './../../functions/paging'
import Paging from '../Utilities/Paging'
import FundFilter from '../Filters/FundFilter'
import * as CurrencyFormat from 'react-currency-format'
import Spinner from './../Utilities/Spinner'

const emptyNotice = {
    letterSpacing: '2px'
}

export class ProgramsFunds extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            onFilter: false,
            funds: props.funds,
            currentPage: 1,
            selectedFundID: '',
            redirect: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)
        // ping server
        this.props.ping()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps && this.state.onFilter == false) {
            if (nextProps.funds.length > 0) {
                this.setState({
                    funds: nextProps.funds
                })
            }
        }
    }

    handleNextClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current + 1
        });
    }

    handlePreviousClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current - 1
        });
    }

    viewFund(fund) {
        this.setState({
            selectedFundID: fund.fundID,
            redirect: true
        })
    }

    receiveFilteredFunds(funds) {
        this.setState({
            funds: funds,
            onFilter: true
        })
    }

    public render() {
        const {
            onFilter,
            currentPage,
            funds,
            redirect,
            selectedFundID
        } = this.state

        let redirectLink = "/Fund/id=" + selectedFundID
        if (redirect) {
            return <Redirect push to={redirectLink} />
        }

        const currentItems = returnCurrentItems(funds, currentPage)
        const pageNumbers = returnPageNumber(funds)
        const renderItems = currentItems.map((fund, index) => {
            return <div className='col-md-12' key={index}>
                <div className='panel'>
                    <div onClick={() => this.viewFund(fund)} className='panel-body text-center panel-button'>
                        <div className='col-md-12'>
                            <h3><b>{fund.fundName}</b></h3>
                            <h4>{fund.fundYear}</h4>
                            <h4><CurrencyFormat value={fund.fundAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h4>
                        </div>
                    </div>
                </div>
            </div>
        })

        return (
            <div>
                <Hydrate />
                {funds.length == 0 && onFilter == false &&
                    <Spinner notice='...loading the funds...' />
                }
                <h2>
                    Programs & Funds
                    <span style={{ marginTop: '-5px' }} className='pull-right'>
                        <FundFilter
                            returnFiltered={this.receiveFilteredFunds.bind(this)} />
                    </span>
                </h2>
                <hr />
                {funds.length > 0 &&
                    <div className='col-md-12'>
                        {renderItems}
                        <br />
                        <br />
                        <Paging
                            count={funds}
                            currentPage={currentPage}
                            totalPages={pageNumbers}
                            next={this.handleNextClick.bind(this)}
                            prev={this.handlePreviousClick.bind(this)} />
                        <br />
                        <br />
                    </div>
                }
                {funds.length == 0 && onFilter == true &&
                    <div className='col-md-12' style={{ margin: '20px 0px' }}>
                        <div className='text-center alert alert-info'>
                            <h2 style={emptyNotice}>No funds matching those criteria</h2>
                        </div>
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