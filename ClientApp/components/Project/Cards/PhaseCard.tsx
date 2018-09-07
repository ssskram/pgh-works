
import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as MilestoneStore from '../../../store/milestones'
import * as SubphaseStore from '../../../store/subphases'

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
            milestones,
            subphases
        } = this.props

        const allMilestones = milestones.filter(function (milestone) {
            return milestone.phaseID == phase.phaseID
        })

        const allSubphases = subphases.filter(function (subphase) {
            return subphase.phaseID == phase.phaseID
        })

        // calculating percent complete to color phase card with
        let totalTaskValue = 0
        let completedTaskValue = 0
        allMilestones.forEach(function (milestone) {
            totalTaskValue = totalTaskValue + 100
            if (milestone.percentComplete == 100) {
                completedTaskValue = completedTaskValue + 100
            }
        })
        allSubphases.forEach(function (subphase) {
            totalTaskValue = totalTaskValue + 100
            completedTaskValue = completedTaskValue + subphase.percentComplete
        })
        let percentComplete = completedTaskValue/totalTaskValue * 100
        let percentRemaining = 100 - percentComplete - 1

        const progressBackground = {
            background: 'linear-gradient(to right, #d5ddf6 ' + percentComplete + '%, #fff 1%, #fff ' + percentRemaining + '%)'
        }
        
        const link = "/Phase/id=" + phase.phaseID

        return (
            <div className="col-sm-12" key={phase.phaseID}>
                <div style={progressBackground} className="panel">
                    <div className="panel-body text-center">
                        <div className='col-md-4'>
                            <h2><b>{phase.phaseName}</b></h2>
                            {phase.actualStartDate && phase.actualEndDate &&
                                <h4>{phase.actualStartDate} - {phase.actualEndDate}</h4>
                            }
                            {!phase.actualStartDate && !phase.actualEndDate &&
                                <h4>{phase.expectedStartDate} - {phase.expectedEndDate}</h4>
                            }
                        </div>
                        <div className='col-md-4'>
                            <h2><i>{allMilestones.length} Milestone{allMilestones.length != 1 && 's'}</i></h2>
                            <h3><i>{allSubphases.length} Subphase{allSubphases.length != 1 && 's'}</i></h3>
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
        ...state.milestones,
        ...state.subphases
    }),
    ({
        ...MilestoneStore.actionCreators,
        ...SubphaseStore.actionCreators
    })
)(PhaseCard as any) as typeof PhaseCard