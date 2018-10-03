
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../store'
import Table from 'react-table'
import * as Drawdowns from '../store/drawdowns'
import * as Funds from '../store/GETS/funds'
import Modal from 'react-responsive-modal'
import DrawdownForm from './Inputs/Drawdown'
import DeleteDrawdown from './DeleteConfirmations/DeleteDrawdown'
import * as CurrencyFormat from 'react-currency-format'

const iconStyle = {
    marginRight: '10px',
    marginTop: '-8px',
    height: '40px'
}

export class ProgramsFunds extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalType: '',
            modalIsOpen: false,
            selectedDrawdown: {},
            selectedFundID: '',

            // drawdowns
            drawdowns: [],
        }
        this.getDrawdowns = this.getDrawdowns.bind(this);
    }

    componentDidMount() {
        this.getDrawdowns(this.props)
        console.log(this.props)
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
                    drawdowns: drawdowns.sort(function (a, b) {
                        return +b.drawdownAmount - +a.drawdownAmount;
                    })
                })
            }
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            modalType: ''
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
            selectedDrawdown: drawdown
        })
    }

    editModal(drawdown) {
        this.setState({
            modalType: 'edit',
            modalIsOpen: true,
            selectedDrawdown: drawdown
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
            selectedDrawdown,
            drawdowns
        } = this.state

        const {
            canEdit
        } = this.props

        let columns = [] as any
        if (canEdit == true) {
            columns = [{
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
                Header: 'Notes',
                accessor: 'notes'
            }, {
                Header: '',
                accessor: 'fundID',
                Cell: props => <button onClick={() => this.deleteModal(props.original)} className='btn btn-danger'><span className='glyphicon glyphicon-remove'></span></button>,
                maxWidth: 75
            }, {
                Header: '',
                accessor: 'fundID',
                Cell: props => <button onClick={() => this.editModal(props.original)} className='btn btn-success'><span className='glyphicon glyphicon glyphicon-info-sign'></span></button>,
                maxWidth: 75
            }]
        } else {
            columns = [{
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
                Header: 'Notes',
                accessor: 'notes'
            }]
        }

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

        // calculating spend thermometer
        let thermometer = {}
        let allocated = 0
        if (this.props.budget != null && this.props.budget != 0 && this.props.budget != '') {
            allocated = spent + encumbered + preencumbered
            const percentBudgetAllocated = allocated / this.props.budget * 100
            const budgetRemaining = 100 - percentBudgetAllocated - 1 * 100
            thermometer = {
                background: 'linear-gradient(to right, #d9534f, ' + percentBudgetAllocated + '%, transparent 1%, transparent ' + budgetRemaining + '%)',
                border: '1px solid #d9534f',
                borderRadius: '100px',
                margin: '10px 0px 20px 0px',
                paddingBottom: '8px'
            }
        }

        return (
            <div>
                <h2>
                    <img style={iconStyle} src='./images/programsGrey.png' />
                    Cost
                    {canEdit == true &&
                        <span>
                            <button onClick={this.newDrawdown.bind(this)} title='Add expenditure' type='button' className='btn btn-secondary pull-right hidden-xs'>
                                <span style={{ fontSize: '20px' }} className='glyphicon glyphicon-plus'></span>
                            </button>
                        </span>
                    }
                </h2>
                <hr />
                {this.props.budget != 0 &&
                    <div>
                        <div className='col-md-12 row'>
                            <h4 className='pull-right'><div className='text-center'>Budget</div><b><CurrencyFormat value={this.props.budget} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></h4>
                            <h4 className='pull-left'><div className='text-center'>Spent</div><CurrencyFormat value={allocated} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h4>
                        </div>
                        <div style={thermometer} className='col-md-12 row'></div>
                    </div>
                }
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
                            showPageJump={false}
                            showPagination={drawdowns.length > 10}
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
                    {modalType == 'edit' &&
                        <DrawdownForm
                            closeModal={this.closeModal.bind(this)}
                            parentID={this.props.parentID}
                            projectID={this.props.projectID}
                            parentType={this.props.parentType}
                            drawdown={selectedDrawdown}
                            edit />
                    }
                    {modalType == 'new' &&
                        <DrawdownForm
                            closeModal={this.closeModal.bind(this)}
                            parentID={this.props.parentID}
                            projectID={this.props.projectID}
                            parentType={this.props.parentType} />
                    }
                    {modalType == 'delete' &&
                        <DeleteDrawdown
                            drawdown={selectedDrawdown}
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