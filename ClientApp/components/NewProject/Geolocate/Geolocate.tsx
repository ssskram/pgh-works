
import * as React from 'react'
import Modal from 'react-responsive-modal'
import Import from './ImportShape'
import New from './NewShape'
import Map from './../../Map/ProjectMap'

export default class Geolocate extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            type: '',
            modalIsOpen: false,
            shape: []
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        });
    }

    importShape() {
        this.setState({
            type: 'import',
            modalIsOpen: true
        })
    }

    newShape() {
        this.setState({
            type: 'new',
            modalIsOpen: true
        })
    }

    setShape(shape) {
        this.props.setShape(shape)
        this.setState({
            shape: shape,
            modalIsOpen: false
        })
    }

    public render() {
        const {
            modalIsOpen,
            shape,
            type
        } = this.state

        return (
            <div className='text-center' >
                <h2><b>Project location</b></h2>
                {shape.length > 0 &&
                    <div>
                        <Map shape={shape}/>
                        <button onClick={this.props.next} className='btn btn-success'>Continue</button>
                    </div>

                }
                {shape.length == 0 &&
                    <div>
                        <button onClick={this.importShape.bind(this)} className='btn btn-primary'>Import shape</button>
                        <button onClick={this.newShape.bind(this)} className='btn btn-primary'>New shape</button>
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
                    {type == 'import' &&
                        <Import />
                    }
                    {type == 'new' &&
                        <New passShape={this.setShape.bind(this)} />
                    }
                </Modal>
            </div>
        )
    }
}