
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import Input from '../FormElements/input'
import SelectionMap from './../Map/ImportShapes'

export class SelectAsset extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            search: '',
            assets: props.assets.filter(asset => asset.assetType == props.assetType)
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        this.filter(event.target.value)
    }

    filter(value) {
        var filteredAssets = this.state.assets.filter(asset => asset.assetName.toLowerCase().includes(value.toLowerCase()))
        if (value != '') {
            this.setState({
                assets: filteredAssets
            })
        } else {
            this.setState({
                assets: this.props.assets.filter(asset => asset.assetType == this.props.assetType)
            })
        }
    }

    public render() {
        const {
            assetType
        } = this.props

        const {
            assets,
            search
        } = this.state

        var searchPlaceholder = "Search for " + assetType

        return (
            <div>
                <div className='col-md-12'>
                    <br />
                    <h3 className='pull-left'>Select {assetType}</h3>
                    <button onClick={this.props.back} className='btn btn-warning pull-right'>Back</button>
                </div>
                <div className='col-md-12'>
                    <Input
                        value={search}
                        name="search"
                        header=""
                        placeholder={searchPlaceholder}
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                <div className='col-md-12 text-center'>
                    <SelectionMap assets={assets}/>
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.taggableAssets
    }),
    ({
        ...Assets.actionCreators
    })
)(SelectAsset as any) as typeof SelectAsset