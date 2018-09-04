
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import TextArea from '../FormElements/textarea'

export class TagDescription extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            taggedAssetName: props.asset.assetName,
            taggedAssetOID: props.asset.assetOID,
            tagType: props.asset.assetType,
            tagDescription: ''
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }

    postTag() {
        this.props.receiveDescription(this.state)
    }

    public render() {
        const {
            tagDescription,
            taggedAssetName,
            writeToAsset
        } = this.state

        const isEnabled = tagDescription != ''

        return (
            <div>
                <div className='col-md-12 text-center'>
                    <h3>{taggedAssetName}</h3>
                    <hr />
                </div>
                <div className='col-md-12'>
                    <TextArea
                        value={tagDescription}
                        name="tagDescription"
                        header="Description"
                        placeholder="Provide a brief explanation for the tag"
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                <div className='col-md-12'>
                    <button onClick={this.props.back} className='btn btn-warning pull-left'>Back</button>
                    <button disabled={!isEnabled} onClick={this.postTag.bind(this)} className='btn btn-success pull-right'>Submit</button>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
    }),
    ({
    })
)(TagDescription as any) as typeof TagDescription