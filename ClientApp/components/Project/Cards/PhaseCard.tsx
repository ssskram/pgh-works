
import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as MilestoneStore from '../../../store/milestones'

const iconStyle = {
    color: '#fff',
    marginTop: '-5px',
    paddingRight: '15px',
    paddingLeft: '15px'
}

export class PhaseCard extends React.Component<any, any> {

    public render() {
        const {
            phase,
            milestones
        } = this.props

        const progressBackground = {
            backgroundColor: ''
        }

        const allMilestones = milestones.filter(function (milestone) {
            return milestone.phaseID == phase.phaseID
        })

        const openMilestones = allMilestones.filter(function (milestone) {
            return milestone.percentComplete < 100
        })

        const link = "/Phase/id=" + phase.phaseID

        return (
            <div className="col-sm-12" key={phase.phaseID}>
                <div style={progressBackground} className="panel">
                    <div className="panel-body text-center">
                        <div className='col-md-4'>
                            <h2><b>{phase.phaseName}</b></h2>
                            <h4>{phase.startDate} - {phase.endDate}</h4>
                        </div>
                        <div className='col-md-4'>
                            <h2>{openMilestones.length} open milestones</h2>
                            <h3><i>{allMilestones.length} total</i></h3>
                        </div>
                        <div className='col-md-4'>
                        <Link to={link} className='btn btn-success'><h2><span style={iconStyle} className='glyphicon glyphicon-arrow-right'></span></h2></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.milestones
    }),
    ({
        ...MilestoneStore.actionCreators
    })
)(PhaseCard as any) as typeof PhaseCard