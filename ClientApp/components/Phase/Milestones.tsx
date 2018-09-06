
import * as React from 'react'
import { connect } from 'react-redux'
import ReactTable from "react-table";
import { ApplicationState } from '../../store'
import * as MilestoneStore from '../../store/milestones'
import Modal from 'react-responsive-modal'
import DeleteMilestone from './../Milestones/DeleteMilestone'
import MilestoneForm from './../Inputs/Milestone'

const iconStyle = {
    marginRight: '5px',
    marginTop: '-8px',
    height: '35px'
}

export class Milestones extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalIsOpen: false,
            modalType: '',

            // milestones
            milestones: [],

            // delete or complete
            selectedMilestone: {}
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
            modalIsOpen: false,
            modalType: ''
        });
    }

    setDelete(milestoneID) {
        let milestone = this.state.milestones.find(function (milestone) {
            return milestone.milestoneID == milestoneID
        })
        this.setState({
            modalIsOpen: true,
            modalType: 'delete',
            selectedMilestone: milestone
        })
    }

    removeMilestone(milestone) {
        // removes milestone locally from state
        // done in step with mutable delete from redux store
        var milestonesCopy = this.state.milestones.slice()
        milestonesCopy.splice(milestonesCopy.indexOf(milestone), 1);
        this.setState({
            milestones: milestonesCopy,
            modalType: ''
        })
    }

    completeMilestone() {
        // modify selected milestone in local state
        // push update to store
    }

    public render() {
        const {
            modalIsOpen,
            milestones,
            selectedMilestone,
            modalType
        } = this.state

        const columns = [{
            Header: 'Name',
            accessor: 'milestoneName'
        }, {
            Header: 'Due date',
            accessor: 'dueDate'
        }, {
            Header: '',
            accessor: 'milestoneID',
            Cell: props => <button className='btn btn-success'><span className='glyphicon glyphicon-ok'></span></button>,
            maxWidth: 100
        }, {
            Header: '',
            accessor: 'milestoneID',
            Cell: props => <button onClick={() => this.setDelete(props.value)} className='btn btn-danger'><span className='glyphicon glyphicon-remove'></span></button>,
            maxWidth: 100
        }]

        const openMilestones = milestones.filter(function (item) {
            return item.percentComplete < 100
        })

        const completedMilestones = milestones.filter(function (item) {
            return item.percentComplete == 100
        })

        return (
            <div>
                <h3><img style={iconStyle} src='./images/milestoneGrey.png' /> Milestones<span><button onClick={this.openModal.bind(this)} className='btn pull-right hidden-xs'>Add milestone</button></span></h3>
                <hr />
                {milestones.length == 0 &&
                    <h4 className='text-center'><i>No milestones</i></h4>
                }
                {openMilestones.length > 0 &&
                    <div className='col-md-12'>
                        <h4><b>Open milestones</b></h4>
                        <ReactTable
                            data={openMilestones}
                            columns={columns}
                            loading={false}
                            minRows={0}
                            pageSize={100}
                            showPagination={false}
                            showPageSizeOptions={false}
                            noDataText=''
                            getTdProps={() => ({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    fontSize: '20px'
                                }
                            })}
                        />
                    </div>
                }
                {completedMilestones.length > 0 &&
                    <div className='col-md-12'>
                        <h4><b>Completed milestones</b></h4>
                        <ReactTable
                            data={completedMilestones}
                            columns={columns}
                            loading={false}
                            minRows={0}
                            pageSize={100}
                            showPagination={false}
                            showPageSizeOptions={false}
                            noDataText=''
                            getTdProps={() => ({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    fontSize: '20px'
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
                    {modalType == 'delete' &&
                        <DeleteMilestone
                            milestone={selectedMilestone}
                            closeModal={this.closeModal.bind(this)}
                            removeMilestone={this.removeMilestone.bind(this)} />
                    }
                    {modalType != 'delete' &&
                        <MilestoneForm
                            phaseID={this.props.phaseID}
                            projectID={this.props.projectID}
                            closeModal={this.closeModal.bind(this)} />
                    }
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