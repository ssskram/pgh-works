
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
            background: 'linear-gradient(to right, #DEF5DE, ' + percentComplete + '%, #fff 1%, #fff ' + percentRemaining + '%)'
        }

        const link = "/Phase/id=" + phase.phaseID

        return (
            <div className="col-sm-6 col-md-4" key={phase.phaseID} >
                <div className='panel' style={progressBackground}>
                    <div className="panel-button">
                        <Link to={link}>
                            <div className="panel-body text-center">
                                <h3><b>{phase.phaseName}</b></h3>
                                <h5>{phase.phaseType}</h5>
                                <h4>{allMilestones.length} Milestone{allMilestones.length != 1 && 's'}</h4>
                                <h4>{allSubphases.length} Subphase{allSubphases.length != 1 && 's'}</h4>
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