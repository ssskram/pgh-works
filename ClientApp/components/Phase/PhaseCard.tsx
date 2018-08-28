
import * as React from 'react'
import Moment from 'react-moment'

const bigFont = {
    fontSize: '18px'
}

const borderNone = {
    border: 'none'
}

const phaseContainer = {
    backgroundColor: '#FFF7EC',
    borderRadius: '10px',
    padding: '10px',
    margin: '5px 0px',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)'
}

const metaContainer = {
    margin: '5px 0px',
    padding: '20px 0px 0px 30px'
}

export default class PhaseCard extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    public render() {
        const {
            cartegraphID,
            startDate,
            endDate,
            phaseDescription,
            phaseStatus,
            percentComplete,
            notes,
            created,
            createdBy,
            lastModifiedBy,
        } = this.props.phase

        return (
            <div>
                <div className='row'>
                    <br />
                    <div style={phaseContainer} className='col-md-6'>
                        <table className="table">
                            <tbody>
                                <tr style={bigFont}>
                                    <th style={borderNone} scope="row">Status</th>
                                    <td style={borderNone}>{phaseStatus}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Start date</th>
                                    <td><Moment format="MM/DD/YYYY" date={startDate} /></td>
                                </tr>
                                <tr>
                                    <th scope="row">End date</th>
                                    <td><Moment format="MM/DD/YYYY" date={endDate} /></td>
                                </tr>
                                {percentComplete &&
                                    <tr>
                                        <th scope="row">Percent complete</th>
                                        <td>% {percentComplete}</td>
                                    </tr>
                                }
                                <tr>
                                    <th scope="row">Description</th>
                                    <td>{phaseDescription}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div style={metaContainer} className='col-md-6'>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <th style={borderNone} scope="row">Phase created</th>
                                    <td style={borderNone}>{created}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Created by</th>
                                    <td>{createdBy}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Last modified by</th>
                                    <td>{lastModifiedBy}</td>
                                </tr>
                                {cartegraphID &&
                                    <tr>
                                        <th scope="row">Cartegraph ID</th>
                                        <td>{cartegraphID}</td>
                                    </tr>
                                }
                                {notes &&
                                    <tr>
                                        <th scope="row">Notes</th>
                                        <td>{notes}</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
