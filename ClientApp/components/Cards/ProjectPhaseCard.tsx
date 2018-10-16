
// phase card on project page

import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as MilestoneStore from '../../store/milestones'
import * as SubphaseStore from '../../store/subphases'
import phasePercentComplete from './../../functions/phasePercentComplete'

export class PhaseCard extends React.Component<any, any> {

    public render() {
        const {
            phase,
            milestones,
            subphases
        } = this.props

        const allMilestones = milestones.filter(function (milestone) {
            return milestone.phaseID == phase.phaseID
        })

        const allSubphases = subphases.filter(function (subphase) {
            return subphase.phaseID == phase.phaseID
        })

        const percentComplete = phasePercentComplete(allMilestones, allSubphases)
        const percentRemaining = 100 - percentComplete - 1
        const progressBackground = {
            background: 'linear-gradient(to right, rgba(255, 187, 95, .1), ' + percentComplete + '%, #fff 1%, #fff ' + percentRemaining + '%)',
            borderRadius: '15px'
        }

        const link = "/Phase/id=" + phase.phaseID

        return (
            <div className="col-sm-12" key={phase.phaseID} >
                <div className='panel' style={progressBackground}>
                    <div className="panel-button">
                        <Link to={link}>
                            <div className="panel-body text-center">
                                <div className='col-md-6'>
                                    <h2><b>{phase.phaseName}</b></h2>
                                    {phase.actualStartDate && phase.actualEndDate &&
                                        <h4>{phase.actualStartDate} - {phase.actualEndDate}</h4>
                                    }
                                    {!phase.actualStartDate && !phase.actualEndDate &&
                                        <h4>{phase.expectedStartDate} - {phase.expectedEndDate}</h4>
                                    }
                                </div>
                                <div className='col-md-6'>
                                    <h2>{allMilestones.length} Milestone{allMilestones.length != 1 && 's'}</h2>
                                    <h3>{allSubphases.length} Subphase{allSubphases.length != 1 && 's'}</h3>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.milestones,
        ...state.subphases
    }),
    ({
        ...MilestoneStore.actionCreators,
        ...SubphaseStore.actionCreators
    })
)(PhaseCard as any) as typeof PhaseCard