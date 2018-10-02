
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Modal from 'react-responsive-modal'
import SubphaseForm from '../Inputs/Subphase'
import DeleteSubphase from './DeleteSubphase'

export class Subphase extends React.Component<any, any> {
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
            subphase,
            canEdit
        } = this.props

        let percentRemaining = 100 - subphase.percentComplete - 1
        const progressBackground = {
            background: 'linear-gradient(to right, rgba(92, 184, 92, .08) ' + subphase.percentComplete + '%, #fff 1%, #fff ' + percentRemaining + '%)'
        }

        return (
            <div className="col-sm-4" >
                <div style={progressBackground} className="panel">
                    {canEdit == true &&
                        <button onClick={this.setDelete.bind(this)} className='pull-right delete-btn'>X</button>
                    }
                    <div className="panel-body text-center">
                        <div className='col-md-12'>
                            <h2><b>{subphase.subphaseName}</b></h2>
                            <h4>{subphase.startDate} - {subphase.endDate}</h4>
                            <h4><i>{subphase.subphaseStatus}</i></h4>
                            <button onClick={this.openModal.bind(this)} className='btn btn-success'><span className='glyphicon glyphicon-info-sign'></span></button>
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
                        <DeleteSubphase
                            subphase={subphase}
                            closeModal={this.closeModal.bind(this)}
                            removeSubphase={this.props.removeSubphase} />
                    }
                    {modalType != 'delete' &&
                        <SubphaseForm
                            canEdit={canEdit}
                            subphaseID={subphase.subphaseID}
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
)(Subphase as any) as typeof Subphase