
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Drawdowns from '../../store/drawdowns'
import Modal from 'react-responsive-modal'
import FundForm from '../Inputs/ProgramsFund'

export class ProgramsFunds extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalIsOpen: false,

            // programs & funds
            programs: [],
        }
        this.getPrograms = this.getPrograms.bind(this);
    }

    getPrograms(props) {
        let programs = props.drawdowns.filter(function (item) {
            return item.projectID == props.projectID
        })
        if (programs.length > 0) {
            this.setState({
                programs: programs
            })
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    openModal() {
        this.setState ({
            modalIsOpen: true
        })
    }

    public render() {
        const {
            modalIsOpen,
            programs
        } = this.state

        return (
            <div>
                <h3>Programs & Funds<span><button onClick={this.openModal.bind(this)} className='btn pull-right hidden-xs'>Associate a program or fund</button></span></h3>
                <hr />
                {programs.length == 0 &&
                    <h4 className='text-center'>There are no programs or funds associated with this project</h4>
                }
                {programs.length > 0 &&
                    <h4 className='text-center'><i>Return phases now</i></h4>
                }
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <FundForm />
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.drawdowns
    }),
    ({
        ...Drawdowns.actionCreators
    })
  )(ProgramsFunds as any) as typeof ProgramsFunds