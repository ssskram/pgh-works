
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as MilestoneStore from '../../store/milestones'
import Modal from 'react-responsive-modal'
import MilestoneCard from './../Milestones/MilestoneCard'
import MilestoneForm from '../Inputs/Milestone'

export class Milestones extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalIsOpen: false,

            // milestones
            milestones: [],
        }
        this.getMilestones = this.getMilestones.bind(this);
    }

    componentDidMount() {
        this.getMilestones(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.getMilestones(nextProps)
    }

    getMilestones(props) {
        if (props.milestones) {
            let milestones = props.milestones.filter(function (item) {
                return item.phaseID == props.phaseID
            })
            if (milestones.length > 0) {
                this.setState({
                    milestones: milestones
                })
            }
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
            modalIsOpen,
            milestones
        } = this.state

        return (
            <div>
                <h3>Milestones<span><button onClick={this.openModal.bind(this)} className='btn pull-right hidden-xs'>Add milestone</button></span></h3>
                <hr/>
                {milestones.length == 0 &&
                    <h4 className='text-center'><i>No milestones</i></h4>
                }
                {milestones.length > 0 &&
                    milestones.map((milestone) => {
                        return (
                            <MilestoneCard milestone={milestone} />
                        )
                    })
                }
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <MilestoneForm
                        phaseID={this.props.phaseID}
                        projectID={this.props.projectID}
                        closeModal={this.closeModal.bind(this)}
                    />
                </Modal>
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
  )(Milestones as any) as typeof Milestones