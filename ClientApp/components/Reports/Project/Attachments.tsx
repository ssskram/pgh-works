
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import * as AttachmentsStore from '../../../store/attachments'
import Modal from 'react-responsive-modal'
import AttachmentModule from '../../Inputs/Attachment'
import Table from 'react-table'
import DeleteAttachment from '../../DeleteConfirmations/DeleteAttachment'
import Viewer from 'react-viewer';
import 'react-viewer/dist/index.css';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

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
            visible: false,
            imageIndex: 1,

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

    // open delete modal
    deleteAttachment(attachment) {
        this.setState({
            visible: false,
            imageIndex: 0,
            selectedAttachment: attachment,
            modalType: 'delete',
            modalIsOpen: true
        })
    }

    removeAttachment(attachment) {
        // removes tag locally from state
        // done in step with mutable delete from redux store
        const attachmentsCopy = this.state.attachments.slice()
        attachmentsCopy.splice(attachmentsCopy.indexOf(attachment), 1);
        this.setState({
            attachments: attachmentsCopy
        })
    }

    setActiveImageIndex(index) {
        this.setState({
            imageIndex: index,
            visible: true
        })
    }

    closeImageModal() {
        this.setState({
            imageIndex: 0,
            visible: false
        })
    }

    public render() {
        const {
            modalIsOpen,
            modalType,
            selectedAttachment,
            attachments,
            visible,
            imageIndex
        } = this.state

        const {
            parentID,
            parentType,
            parentName,
            canEdit
        } = this.props

        let columns = [] as any
        if (canEdit == true) {
            columns = [{
                Header: 'File name',
                accessor: 'attachmentName'
            }, {
                Header: 'Uploaded',
                accessor: 'dateCreated',
            }, {
                Header: '',
                accessor: 'src',
                Cell: props => <a href={props.value} target='_blank' className='btn btn-success'><span className='glyphicon glyphicon-eye-open'></span></a>,
                maxWidth: 75
            }, {
                Header: '',
                accessor: 'attachmentID',
                Cell: props => <button onClick={() => this.deleteAttachment(props.original)} className='btn btn-danger'><span className='glyphicon glyphicon-remove'></span></button>,
                maxWidth: 75
            }]
        } else {
            columns = [{
                Header: 'File name',
                accessor: 'attachmentName'
            }, {
                Header: 'Uploaded',
                accessor: 'dateCreated',
            }, {
                Header: '',
                accessor: 'src',
                Cell: props => <a href={props.value} target='_blank' className='btn btn-success'><span className='glyphicon glyphicon-eye-open'></span></a>,
                maxWidth: 75
            }]
        }

        let files = [] as any
        let images = [] as any
        attachments.forEach(function (attachment) {
            if (attachment.fileName.endsWith(".jpg") || attachment.fileName.endsWith(".jpeg") || attachment.fileName.endsWith(".png")) {
                images.push(attachment)
            } else {
                files.push(attachment)
            }
        })

        const carouselImages = images.map((image, index) =>
            <div onClick={() => this.setActiveImageIndex(index)} key={index}>
                <img style={{ maxWidth: '300px' }} className='img-responsive' src={image.src} />
                <p className="legend">{image.attachmentName}</p>
            </div>
        )

        return (
            <div>
                <h2>
                    <img style={iconStyle} src='./images/attachment.png' />
                    Attachments
                    <span>
                        {canEdit &&
                            <button title='Upload an attachment' onClick={this.addAttachment.bind(this)} type='button' className='btn btn-secondary pull-right hidden-xs'>
                                <span style={{ fontSize: '20px' }} className='glyphicon glyphicon-plus'></span>
                            </button>
                        }
                    </span>
                </h2>
                <hr />
                <div className='col-md-12'>
                    {attachments.length == 0 &&
                        <h4 className='text-center'><i>No attachments</i></h4>
                    }
                    {images.length > 0 &&
                        <div>
                            <Carousel
                                dynamicHeight
                                showThumbs={false}>
                                {carouselImages}
                            </Carousel>
                            <Viewer
                                visible={visible}
                                onClose={this.closeImageModal.bind(this)}
                                images={images}
                                activeIndex={imageIndex}
                                customToolbar={(toolbars) => {
                                    return toolbars.concat([{
                                        key: 'dlt',
                                        render: <div><b>X</b></div>,
                                        onClick: (attachment) => {
                                            this.deleteAttachment(attachment)
                                        },
                                    }]);
                                }}
                            />
                            <br />
                            <br />
                        </div>
                    }
                    {files.length > 0 &&
                        <Table
                            data={files}
                            columns={columns}
                            loading={false}
                            minRows={0}
                            showPageJump={false}
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
                    <div className='col-md-12 text-center' style={{ marginTop: '65px' }}>
                        <a href={'https://cityofpittsburgh.sharepoint.com/sites/pghworks/' + parentName} target='_blank'><span style={{ fontSize: '25px' }}>Document library<span style={{ margin: '4px 0px -12px 12px' }} className='glyphicon glyphicon-arrow-right'></span></span></a>
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