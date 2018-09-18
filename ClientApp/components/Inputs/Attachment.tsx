
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Dropzone from 'react-dropzone'
import Input from '../FormElements/input'
import TextArea from '../FormElements/textarea'
import * as AttachmentsStore from '../../store/attachments'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'

export class Attachment extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            file: [],
            parentID: props.parentID,
            parentType: props.parentType,
            attachmentID: '',
            dateCreated: '',
            attachmentName: '',
            attachmentDescription: '',
            attachmentLink: '',
            fileName: '',
        }
    }

    componentDidMount() {
        const guid: string = uuid()
        this.setState({
            attachmentID: guid,
            dateCreated: moment().format('MM/DD/YYYY')
        })
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    onDrop(file) {
        this.setState({
            file
        });
    }

    save() {
        let attachmentLoad = {
            parentID: this.state.parentID,
            parentType: this.state.parentType,
            attachmentID: this.state.attachmentID,
            dateCreated: this.state.dateCreated,
            attachmentName: this.state.attachmentName,
            attachmentDescription: this.state.attachmentDescription,
            attachmentLink: this.state.file[0].preview,
            fileName: this.state.file[0].name
        }
        this.props.addAttachment(attachmentLoad)
        this.props.closeModal()
    }

    public render() {
        const {
            file,
            attachmentName,
            attachmentDescription,
        } = this.state

        // validation
        const isEnabled =
            attachmentName != '' &&
            attachmentDescription != ''

        return (
            <div className='col-md-12'>
                {file.length == 0 &&
                    <div className="dropzone">
                        <br />
                        <br />
                        <Dropzone onDrop={this.onDrop.bind(this)} className='dropzone-style'>
                            <h3>Drop a file here,<br />or click to select a file</h3>
                        </Dropzone>
                    </div>
                }
                {file.length > 0 &&
                    <div className='col-md-12'>
                        <h3>Attachment description</h3>
                        <hr />
                        <div className='col-md-12'>
                            <Input
                                value={attachmentName}
                                name="attachmentName"
                                header="Attachment name"
                                placeholder="Enter a name"
                                required={true}
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>

                        <div className='col-md-12'>
                            <TextArea
                                value={attachmentDescription}
                                name="attachmentDescription"
                                header="Description"
                                required={true}
                                placeholder="Provide context for the attachment"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>

                        <div className='col-md-12  text-center'>
                            <button disabled={!isEnabled} onClick={this.save.bind(this)} className='btn btn-success'>Save</button>
                        </div>
                    </div>
                }
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
)(Attachment as any) as typeof Attachment