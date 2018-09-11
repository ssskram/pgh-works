
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Table from 'react-table'
import { Redirect } from 'react-router-dom'
import * as Drawdowns from '../../store/drawdowns'
import * as Funds from '../../store/GETS/funds'
import Modal from 'react-responsive-modal'
import DrawdownForm from '../Inputs/ProgramsFund'
import DeleteDrawdown from './DeleteDrawdown'
import * as CurrencyFormat from 'react-currency-format'

const iconStyle = {
    marginRight: '5px',
    marginTop: '-8px',
    height: '35px'
}

export class ProgramsFunds extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalType: '',
            modalIsOpen: false,
            drawdownToDelete: {},
            redirect: false,
            selectedFundID: '',

            // drawdowns
            drawdowns: [],
        }
        this.getDrawdowns = this.getDrawdowns.bind(this);
    }

    componentDidMount() {
        this.getDrawdowns(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.getDrawdowns(nextProps)
    }

    getDrawdowns(props) {
        if (props.drawdowns) {
            let drawdowns = props.drawdowns.filter(function (item) {
                return item.parentID == props.parentID
            })
            if (drawdowns.length > 0) {
                this.setState({
                    drawdowns: drawdowns
                })
            }
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    newDrawdown() {
        this.setState({
            modalType: 'new',
            modalIsOpen: true
        })
    }

    redirectToFund(fundID) {
        this.setState({
            redirect: true,
            selectedFundID: fundID
        })
    }

    deleteModal(drawdown) {
        this.setState({
            modalType: 'delete',
            modalIsOpen: true,
            drawdownToDelete: drawdown
        })
    }

    removeDrawdown(drawdown) {
        var drawdownCopy = this.state.drawdowns.slice()
        drawdownCopy.splice(drawdownCopy.indexOf(drawdown), 1);
        this.setState({
            drawdowns: drawdownCopy
        })
    }

    getFund(id) {
        const fund = this.props.funds.find(function (fund) {
            return fund.fundID == id
        })
        return fund
    }

    getFundName(fundID) {
        const fund = this.getFund(fundID)
        return fund.fundName
    }

    getFundYear(fundID) {
        const fund = this.getFund(fundID)
        return fund.fundYear
    }

    getFundType(fundID) {
        const fund = this.getFund(fundID)
        return fund.fundType
    }

    public render() {
        const {
            modalType,
            modalIsOpen,
            drawdownToDelete,
            redirect,
            selectedFundID,
            drawdowns
        } = this.state

        const columns = [{
            Header: 'Fund/Program',
            accessor: 'fundID',
            Cell: props => <div>{this.getFundName(props.value)}</div>
        }, {
            Header: 'Year',
            accessor: 'fundID',
            Cell: props => <div>{this.getFundYear(props.value)}</div>
        }, {
            Header: 'Type',
            accessor: 'fundID',
            Cell: props => <div>{this.getFundType(props.value)}</div>
        }, {
            Header: 'Drawdown Amount',
            accessor: 'drawdownAmount',
            Cell: props => <CurrencyFormat value={props.value} displayType={'text'} thousandSeparator={true} prefix={'$'} />
        }, {
            Header: 'Drawdown Type',
            accessor: 'drawdownType'
        }, {
            Header: '',
            accessor: 'fundID',
            Cell: props => <button onClick={() => this.deleteModal(props.original)} className='btn btn-danger'><span className='glyphicon glyphicon-remove'></span></button>,
            maxWidth: 75
        }, {
            Header: '',
            accessor: 'fundID',
            Cell: props => <button onClick={() => this.redirectToFund(props.value)} className='btn btn-success'><span className='glyphicon glyphicon-eye-open'></span></button>,
            maxWidth: 75
        }]

        // calculating project costs
        let spent = 0
        let encumbered = 0
        let preencumbered = 0
        drawdowns.forEach(function (item) {
            if (item.drawdownType == 'Spent') {
                spent = spent + item.drawdownAmount
            }
            if (item.drawdownType == 'Encumbered') {
                encumbered = encumbered + item.drawdownAmount
            }
            if (item.drawdownType == 'Pre-encumbered') {
                preencumbered = preencumbered + item.drawdownAmount
            }
        })

        let redirectLink = "/Fund/id=" + selectedFundID
        if (redirect) {
            return <Redirect to={redirectLink} />
        }

        return (
            <div>
                <h3><img style={iconStyle} src='./images/programsGrey.png' /> Programs & Funds<span><button onClick={this.newDrawdown.bind(this)} className='btn pull-right hidden-xs'>Associate a program or fund</button></span></h3>
                <hr />

                <div className='col-md-12'>
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
                {drawdowns.length > 0 &&
                    <div>
                        <Table
                            data={drawdowns}
                            columns={columns}
                            loading={false}
                            minRows={0}
                            pageSize={10}
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
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    {modalType == 'new' &&
                        <DrawdownForm
                            closeModal={this.closeModal.bind(this)}
                            parentID={this.props.parentID}
                            parentType={this.props.parentType} />
                    }
                    {modalType == 'delete' &&
                        <DeleteDrawdown
                            drawdown={drawdownToDelete}
                            removeDrawdown={this.removeDrawdown.bind(this)}
                            closeModal={this.closeModal.bind(this)} />
                    }
                </Modal>
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
)(ProgramsFunds as any) as typeof ProgramsFunds