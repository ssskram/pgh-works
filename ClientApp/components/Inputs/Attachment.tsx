
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Dropzone from 'react-dropzone'
import Select from '../FormElements/select'
import * as AttachmentsStore from '../../store/attachments'
import { v1 as uuid } from 'uuid'
import * as moment from 'moment'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

const types = [
    { value: 'Final contract', label: 'Final contract', name: 'attachmentName' },
    { value: 'Final legislation', label: 'Final legislation', name: 'attachmentName' },
    { value: 'Before', label: 'Before (img)', name: 'attachmentName' },
    { value: 'After', label: 'After (img)', name: 'attachmentName' }
]

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
            src: '',
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

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
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
            src: this.state.file[0].preview,
            fileName: this.state.file[0].name
        }
        this.props.addAttachment(attachmentLoad)
        this.props.closeModal()
    }

    public render() {
        const {
            file,
            attachmentName
        } = this.state

        // validation
        const isEnabled =
            attachmentName != ''

        return (
            <div className='col-md-12'>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                {file.length == 0 &&
                    <div className="dropzone">
                        <br />
                        <br />
                        <h3 className='text-center'><i><b>Coming soon!</b></i></h3>
                        <Dropzone onDrop={this.onDrop.bind(this)} disabled={true} className='dropzone-style'>
                            <h3>Drop a file here,<br />or click to select a file</h3>
                        </Dropzone>
                    </div>
                }
                {file.length > 0 &&
                    <div className='col-md-12'>
                        <div className='col-md-12'>
                            <Select
                                value={attachmentName}
                                name="attachmentName"
                                header='Select attachment type'
                                placeholder='Select type'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                required={true}
                                options={types}
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