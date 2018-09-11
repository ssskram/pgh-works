
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as AttachmentsStore from '../../store/attachments'
import Modal from 'react-responsive-modal'
import AttachmentModule from '../Inputs/Attachment'
import Table from 'react-table'
import DeleteAttachment from './DeleteAttachment'

const iconStyle = {
    marginRight: '5px',
    marginTop: '-8px',
    height: '35px'
}

export class Attachments extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            // utilities
            modalIsOpen: false,
            modalType: '',

            // attachments
            selectedAttachment: {},
            attachments: [],
        }
        this.getAttachments = this.getAttachments.bind(this);
    }

    componentDidMount() {
        this.getAttachments(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.getAttachments(nextProps)
    }

    getAttachments(props) {
        if (props.attachments) {
            let attachments = props.attachments.filter(function (item) {
                return item.parentID == props.parentID
            })
            if (attachments.length > 0) {
                this.setState({
                    attachments: attachments
                })
            }
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false,
            modalType: '',
            selectedAttachment: {}
        });
    }

    addAttachment() {
        this.setState({
            modalIsOpen: true,
            modalType: 'add'
        })
    }

    // delete attachment from store
    deleteAttachment(attachment) {
        this.setState ({
            selectedAttachment: attachment,
            modalType: 'delete',
            modalIsOpen: true
        })
    }

    removeAttachment(attachment) {
        // removes tag locally from state
        // done in step with mutable delete from redux store
        var attachmentsCopy = this.state.attachments.slice()
        attachmentsCopy.splice(attachmentsCopy.indexOf(attachment), 1);
        this.setState ({
            attachments: attachmentsCopy
        })
    }

    public render() {
        const {
            modalIsOpen,
            modalType,
            selectedAttachment,
            attachments
        } = this.state

        const {
            parentID,
            parentType
        } = this.props

        const columns = [{
            Header: 'Attachment',
            accessor: 'attachmentName'
        }, {
            Header: 'Description',
            accessor: 'attachmentDescription',
        }, {
            Header: 'Uploaded',
            accessor: 'dateCreated',
        }, {
            Header: '',
            accessor: 'attachmentLink',
            Cell: props => <a href={props.value} target='_blank' className='btn btn-success'><span className='glyphicon glyphicon-eye-open'></span></a>,
            maxWidth: 75
        }, {
            Header: '',
            accessor: 'attachmentID',
            Cell: props => <button onClick={() => this.deleteAttachment(props.original)} className='btn btn-danger'><span className='glyphicon glyphicon-remove'></span></button>,
            maxWidth: 75
        }]

        return (
            <div>
                <h3><img style={iconStyle} src='./images/attachment.png' /> Attachments<span><button onClick={this.addAttachment.bind(this)} className='btn pull-right hidden-xs'>Upload an attachment</button></span></h3>
                <hr />
                <div className='col-md-12'>
                    {attachments.length == 0 &&
                        <h4 className='text-center'><i>No attachments</i></h4>
                    }
                    {attachments.length > 0 &&
                        <Table
                            data={attachments}
                            columns={columns}
                            loading={false}
                            minRows={0}
                            showPagination={false}
                            showPageSizeOptions={false}
                            noDataText=''
                            getTdProps={() => ({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    fontSize: '16px'
                                }
                            })}
                        />
                    }
                </div>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    {modalType == 'add' &&
                        <AttachmentModule
                            parentID={parentID}
                            parentType={parentType}
                            closeModal={this.closeModal.bind(this)} />
                    }
                    {modalType == 'delete' &&
                        <DeleteAttachment
                            attachment={selectedAttachment}
                            removeAttachment={this.removeAttachment.bind(this)}
                            closeModal={this.closeModal.bind(this)} />
                    }
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.attachments
    }),
    ({
        ...AttachmentsStore.actionCreators
    })
)(Attachments as any) as typeof Attachments