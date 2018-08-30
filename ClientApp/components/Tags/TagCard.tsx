
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as TagStore from '../../store/tags'
import { Redirect } from 'react-router-dom'
import Modal from 'react-responsive-modal'
import DeleteTag from './DeleteTag'
import TaggedAssetReport from './TaggedAssetReport'

export class TagsCard extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            redirect: false,
            redirectTo: '',
            modalType: '',
            modalIsOpen: false
        }
    }

    deleteTag() {
        this.setState({
            modalIsOpen: true,
            modalType: 'delete'
        })
    }

    inspectFacility() {
        this.setState({
            modalIsOpen: true,
            modalType: 'inspect'
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            modalType: ''
        })
    }

    redirect(link) {
        this.setState({
            modalIsOpen: false,
            redirect: true,
            redirectTo: link
        })
    }

    public render() {
        const {
            redirect,
            redirectTo,
            modalIsOpen,
            modalType
        } = this.state

        const {
            tag
        } = this.props

        let src = ''
        if (tag.tagType == "Steps") {
            src = './images/assetTypes/steps.png'
        }
        if (tag.tagType == "Facility") {
            src = './images/assetTypes/facilities.png'
        }
        if (tag.tagType == "Project") {
            src = './images/assetTypes/projects.png'
        }
        if (tag.tagType == "Retaining Wall") {
            src = './images/assetTypes/wall.png'
        }
        if (tag.tagType == "Pool") {
            src = './images/assetTypes/pools.png'
        }
        if (tag.tagType == "Playground") {
            src = './images/assetTypes/playground.png'
        }
        if (tag.tagType == "Intersection") {
            src = './images/assetTypes/signal.png'
        }
        if (tag.tagType == "Bridge") {
            src = './images/assetTypes/bridges.png'
        }
        if (tag.tagType == "Court") {
            src = './images/assetTypes/courts.png'
        }
        if (tag.tagType == "Playing Field") {
            src = './images/assetTypes/baseball.png'
        }
        if (tag.tagType == "Park") {
            src = './images/assetTypes/parks.png'
        }

        if (redirect == true) {
            return <Redirect to={redirectTo} />
        }

        return (
            <div className="col-sm-4">
                <div className="panel">
                    <button onClick={this.deleteTag.bind(this)} className='pull-right delete-btn'>X</button>
                    <div className="panel-body text-center">
                        <h3>{tag.taggedAssetName}</h3>
                        <img src={src} />
                        <h4><b>{tag.tagType}</b></h4>
                        <h4><i>"{tag.tagDescription}"</i></h4>
                        <button onClick={this.inspectFacility.bind(this)} className='btn btn-success'><span className='glyphicon glyphicon-search'></span></button>
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
                        <DeleteTag
                            tag={tag}
                            removeTag={this.props.removeTag}
                            closeModal={this.closeModal.bind(this)} />
                    }
                    {modalType == 'inspect' &&
                        <TaggedAssetReport
                            redirect={this.redirect.bind(this)}
                            tag={tag} />
                    }
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
)(TagsCard as any) as typeof TagsCard