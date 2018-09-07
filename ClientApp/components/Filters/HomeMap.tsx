
import * as React from 'react'
import Modal from 'react-responsive-modal'
import ProjectFilters from './ProjectFilter'

const btnStyle = {
    fontSize: '25px',
    backgroundColor: 'rgb(255, 255, 255)',
    padding: '8px'
}

export default class MapFilter extends React.Component<any, any> {
    constructor () {
        super() 
        this.state = {
            modalIsOpen: false
        }
    }

    closeModal () {
        this.setState ({
            modalIsOpen: false
        })
    }
    
    openModal () {
        this.setState ({
            modalIsOpen: true
        })
    }

    public render() {
        const {
            modalIsOpen
        } = this.state
        return (
            <div>
                <button onClick={this.openModal.bind(this)} style={btnStyle}>Filter projects</button>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
    `               <ProjectFilters />
                </Modal>
            </div>
        )
    }
}