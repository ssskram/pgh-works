
// related asset card for both project and phase pages

import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as TagStore from '../../store/tags'
import Modal from 'react-responsive-modal'
import DeleteTag from '../DeleteConfirmations/DeleteTag'
import returnAssetIcon from './../../functions/getAssetIcon'

const imgHeight = {
    height: '50px'
}

const marginTop = {
    marginTop: '20px'
}

export class TagsCard extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            modalIsOpen: false,
            redirectLink: ''
        }
    }

    componentDidMount() {
        const tag = this.props.tag
        if (tag.tagType == 'Street') {
            this.setState({
                redirectLink: '/Asset/street=' + tag.taggedAssetName
            })
        } else {
            this.setState({
                redirectLink: '/Asset/id=' + tag.taggedAssetOID
            })
        }
    }

    deleteTag() {
        this.setState({
            modalIsOpen: true
        })
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    public render() {
        const {
            modalIsOpen,
            redirectLink
        } = this.state

        const {
            tag,
            canEdit
        } = this.props

        let src = returnAssetIcon(tag.tagType)

        return (
            <div className="col-lg-4 col-md-6 col-sm-12">
                <div className="panel">
                    {canEdit == true &&
                        <button onClick={this.deleteTag.bind(this)} className='pull-right delete-btn'>X</button>
                    }
                    <div className="panel-body text-center">
                        <div className='col-md-12'>
                            <img src={src} style={imgHeight} />
                            <h4><b>{tag.tagType}</b></h4>
                            <h3>{tag.taggedAssetName}</h3>
                            <h4><i>"{tag.tagDescription}"</i></h4>
                            <Link to={redirectLink} style={marginTop} className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></Link>
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
                    <DeleteTag
                        tag={tag}
                        removeTag={this.props.removeTag}
                        closeModal={this.closeModal.bind(this)} />
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