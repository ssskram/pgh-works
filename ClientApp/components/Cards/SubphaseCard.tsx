
// subphase card on phase page

import * as React from 'react'
import Modal from 'react-responsive-modal'
import SubphaseForm from '../Inputs/Subphase'
import DeleteSubphase from '../DeleteConfirmations/DeleteSubphase'

export default class Subphase extends React.Component<any, any> {
    constructor(props) {
        super(props)
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
            modalIsOpen: false,
            modalType: ''
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
            background: 'linear-gradient(to right, #DAECFB ' + subphase.percentComplete + '%, #fff 1%, #fff ' + percentRemaining + '%)'
        }

        return (
            <div className="col-md-6" >
                <div style={progressBackground} className="panel">
                    {canEdit == true &&
                        <button onClick={this.setDelete.bind(this)} className='pull-right delete-btn'>X</button>
                    }
                    <div className="panel-body text-center">
                        <div className='col-md-12'>
                            <h3><b>{subphase.subphaseName}</b></h3>
                            <h4><i>{subphase.subphaseStatus}</i></h4>
                            <h4>{subphase.startDate} - {subphase.endDate}</h4>
                            {subphase.subphaseDescription != '' &&
                                <h5>"{subphase.subphaseDescription}"</h5>
                            }
                            <button onClick={this.openModal.bind(this)} className='btn'><span className='glyphicon glyphicon-info-sign'></span></button>
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