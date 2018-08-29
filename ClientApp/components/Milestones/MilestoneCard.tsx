
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Modal from 'react-responsive-modal'
import MilestoneForm from '../Inputs/Milestone'
import DeleteMilestone from './DeleteMilestone'

export class Milestone extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            modalType: '',
            modalIsOpen: false
        }
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    setDelete() {
        this.setState({
            modalType: 'delete',
            modalIsOpen: true
        })
    }

    public render() {
        const {
            modalIsOpen,
            modalType
        } = this.state

        const {
            milestone
        } = this.props

        const progressBackground = {
            backgroundColor: ''
        }

        return (
            <div className="col-sm-4" >
                <div style={progressBackground} className="panel">
                    <button onClick={this.setDelete.bind(this)} className='pull-right delete-btn'>X</button>
                    <div className="panel-body text-center">
                        <div className='col-md-12'>
                            <h2><b>{milestone.milestoneName}</b></h2>
                            <h4>{milestone.startDate} - {milestone.endDate}</h4>
                            <h4><i>{milestone.milestoneStatus}</i></h4>
                            <button onClick={this.openModal.bind(this)} className='btn btn-success'><span className='glyphicon glyphicon-search'></span></button>
                        </div>
                    </div>
                </div>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    {modalType == 'delete' &&
                        <DeleteMilestone
                            milestone={milestone}
                            closeModal={this.closeModal.bind(this)}
                            removeMilestone={this.props.removeMilestone} />
                    }
                    {modalType != 'delete' &&
                        <MilestoneForm
                            milestoneID={milestone.milestoneID}
                            closeModal={this.closeModal.bind(this)}
                        />
                    }
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
    }),
    ({
    })
)(Milestone as any) as typeof Milestone