
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import * as TagStore from '../../store/tags'
import Input from '../FormElements/input'
import SelectionMap from './../Maps/ImportShapes'
import { StreetSelection } from './../Inputs/StreetSelection'

export class SelectAsset extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            search: '',
            assets: [],
            showMap: true,
            grabby: false,
            streetName: ''
        }
    }

    componentDidMount() {
        if (this.props.assetType == 'Street') {
            this.setState({
                showMap: false
            })
        } else {
            this.setState({
                assets: this.props.assets.filter(asset => asset.assetType == this.props.assetType)
            })
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

    handleStreetSelection(streetName) {
        this.props.setStreetName(streetName)
        this.setState({
            assets: this.props.assets.filter(asset => asset.assetType == this.props.assetType).filter(asset => asset.assetName == streetName.value),
            showMap: true,
            grabby: true,
            streetName: streetName.value
        })
    }

    public render() {
        const {
            assetType,
            back
        } = this.props

        const {
            assets,
            search,
            showMap,
            grabby,
            streetName
        } = this.state

        var searchPlaceholder = "Search for " + assetType

        return (
            <div>
                {showMap == true &&
                    <div>
                        <div className='col-md-12 text-center'>
                            <br />
                            {grabby != true &&
                                <h3>Select {assetType}</h3>
                            }
                            {grabby == true &&
                                <h3>Outline the relevant portion of {streetName}</h3>
                            }
                        </div>
                        {grabby != true &&
                            <div className='col-md-12'>
                                <Input
                                    value={search}
                                    name="search"
                                    header=""
                                    placeholder={searchPlaceholder}
                                    callback={this.handleChildChange.bind(this)}
                                />
                            </div>
                        }
                        <div className='col-md-12 text-center'>
                            <SelectionMap
                                assets={assets}
                                receiveAsset={this.props.receiveAsset}
                                grabby={grabby}
                                passShape={this.props.receiveShape.bind(this)} />
                        </div>
                        <div className='col-md-12 text-center'>
                            <button onClick={back} className='btn btn-warning'>Back</button>
                        </div>
                    </div>
                }
                {showMap == false &&
                    <StreetSelection
                        assets={this.props.assets}
                        returnStreet={this.handleStreetSelection.bind(this)} />
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.taggableAssets,
        ...state.tags,
    }),
    ({
        ...Assets.actionCreators,
        ...TagStore.actionCreators,
    })
)(SelectAsset as any) as typeof SelectAsset