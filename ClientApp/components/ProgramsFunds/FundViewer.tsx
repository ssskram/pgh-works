
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Drawdowns from '../../store/drawdowns'
import * as Funds from '../../store/GETS/funds'
import * as CurrencyFormat from 'react-currency-format'

const emptyNotice = {
    letterSpacing: '2px'
}

export class FundViewer extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            drawdowns: props.drawdowns.filter(function (drawdown) {
                return drawdown.fundID == props.match.params.id
            }),
            fundName: '',
            fundYear: '',
            fundAmount: '',
            expirationDate: '',
            fundType: ''
        }
    }
    componentDidMount() {
        this.findFund(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.findFund(nextProps)
    }

    findFund(props) {
        const id = this.props.match.params.id
        let fund = props.funds.find(function (item) {
            return item.fundID == id
        })
        if (fund) {
            this.setFundState(fund)
        }
    }

    setFundState(fund) {
        this.setState({
            fundName: fund.fundName,
            fundYear: fund.fundYear,
            fundAmount: fund.fundAmount,
            expirationDate: fund.expirationDate,
            fundType: fund.fundType
        })
    }

    public render() {
        const {
            drawdowns,
            fundName,
            fundYear,
            fundAmount,
            expirationDate,
            fundType
        } = this.state

        let spent = 0
        let encumbered = 0
        let preencumbered = 0
        let amountRemaining = fundAmount

        return (
            <div>
                <h2>{fundName}</h2>
                <h4>Year: <b>{fundYear}</b></h4>
                <h4>Type: <b>{fundType}</b></h4>
                <h4>Original amount: <CurrencyFormat value={fundAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h4>
                {expirationDate &&
                    <h4><i>Expires on {expirationDate}</i></h4>
                }
                <hr />
                {drawdowns.length == 0 &&
                    <div className='text-center alert alert-info'>
                        <h1 style={emptyNotice} >No drawdowns on this fund</h1>
                    </div>
                }
                <div className='text-center alert alert-success'>
                    <h1><CurrencyFormat value={amountRemaining} displayType={'text'} thousandSeparator={true} prefix={'$'} /> unencumbered</h1>
                </div>
                <div className='col-md-12'>
                    <br />
                    <div className='col-md-4 text-center'>
                        <div className='panel'>
                            <div className='panel-body'>
                                <h3>Spent</h3>
                                <h1><CurrencyFormat value={spent} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h1>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 text-center'>
                        <div className='panel'>
                            <div className='panel-body'>
                                <h3>Encumbered</h3>
                                <h1><CurrencyFormat value={encumbered} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h1>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-4 text-center'>
                        <div className='panel'>
                            <div className='panel-body'>
                                <h3>Pre-encumbered</h3>
                                <h1><CurrencyFormat value={preencumbered} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.drawdowns,
        ...state.funds
    }),
    ({
        ...Drawdowns.actionCreators,
        ...Funds.actionCreators
    })
)(FundViewer as any) as typeof FundViewer