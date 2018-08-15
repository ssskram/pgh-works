
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as TagStore from '../../store/tags'
import Modal from 'react-responsive-modal'
import TagModule from '../Inputs/Tag'


export class Tags extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalIsOpen: false,

            // tags
            tags: [],
        }
        this.getTags = this.getTags.bind(this);
    }

    componentDidMount() {
        this.getTags(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.getTags(this.props)
    }

    getTags(props) {
        let tags = props.tags.filter(function (item) {
            return item.projectID == props.projectID
        })
        if (tags.length > 0) {
            this.setState({
                tags: tags
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
            tags
        } = this.state
        
        return (
            <div>
                <h3>Tags<span><button onClick={this.openModal.bind(this)} className='btn pull-right hidden-xs'>Add a tag</button></span></h3>
                <hr />
                {tags.length == 0 &&
                    <h4 className='text-center'>There are no tags on this project</h4>
                }
                {tags.length > 0 &&
                    <h4 className='text-center'><i>Return tags now</i></h4>
                }
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <TagModule />
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.tags
    }),
    ({
        ...TagStore.actionCreators
    })
)(Tags as any) as typeof Tags