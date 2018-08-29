
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Modal from 'react-responsive-modal'
import MilestoneForm from '../Inputs/Milestone'

export class Milestone extends React.Component<any, any> {
    constructor () {
        super()
        this.state = {
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

    public render() {
        const {
            modalIsOpen
        } = this.state
        const {
            milestone
        } = this.props

        const progressBackground = {
            backgroundColor: ''
        }

        return (
            <div className="col-sm-4" key={milestone.milestoneID}>
                <div style={progressBackground} className="panel">
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
                    <MilestoneForm
                        milestoneID={milestone.milestoneID}
                        closeModal={this.closeModal.bind(this)}
                    />
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