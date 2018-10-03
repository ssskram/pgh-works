import * as React from 'react';
import Modal from 'react-responsive-modal'

export default class Spinner extends React.Component<any, any> {
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