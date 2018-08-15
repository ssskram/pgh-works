import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../../store';
import Modal from 'react-responsive-modal'

export class Spinner extends React.Component<any, any> {
    constructor() {
        super();
    }

    closeModal() {
        // just required for modal lib
    }

    public render() {
        const {
            notice
        } = this.props

        return <div>
            <Modal
                open={true}
                onClose={this.closeModal.bind(this)}
                classNames={{
                    overlay: 'spinner-overlay',
                    modal: 'spinner-modal'
                }}
                animationDuration={1000}
                closeOnEsc={false}
                closeOnOverlayClick={false}
                showCloseIcon={false}
                center>
                <div className="loader"></div>
                {notice}
            </Modal>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({

    }),
    ({

    })
)(Spinner as any) as typeof Spinner;