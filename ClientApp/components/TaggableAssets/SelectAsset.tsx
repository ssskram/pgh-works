
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import Table from "react-table"
import Input from '../FormElements/input'

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

        const columns = [{
            Header: 'Name of ' + assetType,
            Cell: props => <button className='btn btn-success' onClick={() => this.props.receiveAsset(props.original)}>{props.original.assetName}</button>
        }]

        var searchPlaceholder = "Search for " + assetType

        return (
            <div>
                <h3>Select {assetType}</h3>
                <hr />
                <div className='row'>
                    <div className='col-md-12'>
                        <Input
                            value={search}
                            name="search"
                            header=""
                            placeholder={searchPlaceholder}
                            callback={this.handleChildChange.bind(this)}
                        />
                    </div>
                    <div className='col-md-12'>
                        <Table
                            data={assets}
                            columns={columns}
                            loading={false}
                            minRows={0}
                            pageSize={25}
                            showPageSizeOptions={false}
                            noDataText=''
                            getTdProps={() => ({
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center'
                                }
                            })}
                        />
                        <br />
                    </div>
                    <div className='col-md-12 text-center'>
                        <button onClick={this.props.back} className='btn btn-warning'>Back</button>
                    </div>
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