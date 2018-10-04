
// returns fund/program data
// and then returns all drawdowns on fund/program

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import Spinner from '../../Utilities/Spinner'
import { Redirect } from 'react-router-dom'
import Table from 'react-table'
import * as Drawdowns from '../../../store/drawdowns'
import * as Projects from '../../../store/projects'
import * as Funds from '../../../store/GETS/funds'
import * as CurrencyFormat from 'react-currency-format'
import Hydrate from './../../Utilities/HydrateStore'

const emptyNotice = {
    letterSpacing: '2px'
}

export class FundViewer extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            redirect: false,
            spinner: true,
            selectedProjectID: '',
            drawdowns: [],
            fundName: '',
            fundYear: '',
            fundAmount: '',
            expirationDate: '',
            fundType: ''
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        let self = this
        if (this.props.funds.length > 0) {
            this.findFund(this.props)
        }
        if (this.props.drawdowns.length > 0) {
            this.setState({
                drawdowns: this.props.drawdowns.filter(function (drawdown) {
                    return (drawdown.fundID == self.props.match.params.id) && (drawdown.parentType == 'Project')
                })
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        let self = this
        if (this.props != nextProps) {
            if (nextProps.funds.length > 0) {
                this.findFund(nextProps)
            }
            if (nextProps.drawdowns.length > 0) {
                this.setState({
                    drawdowns: nextProps.drawdowns.filter(function (drawdown) {
                        return (drawdown.fundID == self.props.match.params.id) && (drawdown.parentType == 'Project')
                    })
                })
            }
        }
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
            spinner: false,
            fundName: fund.fundName,
            fundYear: fund.fundYear,
            fundAmount: fund.fundAmount,
            expirationDate: fund.expirationDate,
            fundType: fund.fundType
        })
    }

    redirectToProject(projectID) {
        this.setState({
            redirect: true,
            selectedProjectID: projectID
        })
    }

    getProject(id) {
        const project = this.props.projects.find(function (project) {
            return project.projectID == id
        })
        return project
    }

    getProjectName(projectID) {
        const project = this.getProject(projectID)
        return project.projectName
    }

    public render() {
        const {
            redirect,
            spinner,
            selectedProjectID,
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
        let amountRemaining = fundAmount - spent - encumbered - preencumbered

        const columns = [{
            Header: 'Project',
            accessor: 'parentID',
            Cell: props => <div>{this.getProjectName(props.value)}</div>
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
            accessor: 'parentID',
            Cell: props => <button onClick={() => this.redirectToProject(props.value)} className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></button>,
            maxWidth: 75
        }]

        let redirectLink = "/Project/id=" + selectedProjectID
        if (redirect) {
            return <Redirect to={redirectLink} />
        }

        return (
            <div>
                <Hydrate />
                {spinner == true &&
                    <Spinner notice='...loading the fund report...' />
                }
                {spinner == false &&
                    <div>
                        <h2>{fundName}</h2>
                        <h4>Year: <b>{fundYear}</b></h4>
                        <h4>Type: <b>{fundType}</b></h4>
                        <h4>Original amount: <b><CurrencyFormat value={fundAmount} displayType={'text'} thousandSeparator={true} prefix={'$'} /></b></h4>
                        {expirationDate &&
                            <h4><i>Expires on {expirationDate}</i></h4>
                        }
                        <hr />
                        {drawdowns.length == 0 &&
                            <div className='text-center alert alert-info'>
                                <h1 style={emptyNotice} >No drawdowns on this fund</h1>
                            </div>
                        }
                        {amountRemaining >= 0 &&
                            <div className='text-center alert alert-success'>
                                <h1><CurrencyFormat value={amountRemaining} displayType={'text'} thousandSeparator={true} prefix={'$'} /> unencumbered</h1>
                            </div>
                        }
                        {amountRemaining < 0 &&
                            <div className='text-center alert alert-danger'>
                                <h1><b>Overdrawn</b></h1>
                                <h1><CurrencyFormat value={amountRemaining} displayType={'text'} thousandSeparator={true} prefix={'$'} /></h1>
                            </div>
                        }
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
                        {drawdowns.length > 0 &&
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
                        }
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.drawdowns,
        ...state.projects,
        ...state.funds
    }),
    ({
        ...Drawdowns.actionCreators,
        ...Funds.actionCreators,
        ...Projects.actionCreators
    })
)(FundViewer as any) as typeof FundViewer