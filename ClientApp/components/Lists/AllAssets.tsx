
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as Assets from '../../store/GETS/taggableAssets'
import * as Tags from '../../store/tags'
import Table from 'react-table'
import AssetFilter from './../Filters/AssetFilter'
import Spinner from '../Utilities/Spinner'

export class AllAssets extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            assets: [],
            redirectLink: '',
            redirect: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        this.setAssets(this.props)
    }

    componentWillReceiveProps(nextProps) {
        this.setAssets(nextProps)
    }

    setAssets(props) {
        // filter out duplicate streets
        var uniqueAssetNames = this.removeDuplicates(props.assets, "assetName")
        this.setState({
            assets: uniqueAssetNames
        })
    }
    removeDuplicates(originalArray, prop) {
        var newArray = [] as any
        var lookupObject = {}

        for (var i in originalArray) {
            lookupObject[originalArray[i][prop]] = originalArray[i]
        }

        for (i in lookupObject) {
            newArray.push(lookupObject[i])
        }
        return newArray;
    }

    getAssetLink(props) {
        if (props.assetType != 'Street') {
            this.setState({
                redirectLink: "/Asset/id=" + props.assetOID,
                redirect: true
            })
        } else {
            this.setState({
                redirectLink: "/Asset/street=" + props.assetName,
                redirect: true
            })
        }
    }

    returnCountTags(props) {
        if (props.assetType != 'Street') {
            const relevantTags = this.props.tags.filter(function (tag) {
                return tag.taggedAssetOID == props.assetOID
            })
            return relevantTags.length
        } else {
            const relevantTags = this.props.tags.filter(function (tag) {
                return tag.taggedAssetName == props.assetName
            })
            return relevantTags.length
        }
    }

    public render() {
        const {
            assets,
            redirectLink,
            redirect
        } = this.state

        const columns = [{
            Header: 'Asset',
            accessor: 'assetName'
        }, {
            Header: 'Type',
            accessor: 'assetType',
        }, {
            Header: 'Cartegraph ID',
            accessor: 'assetOID'
        }, {
            Header: 'Number of tags',
            id: 'count',
            accessor: props => this.returnCountTags(props)
        }, {
            Header: '',
            Cell: props => <button onClick={() => this.getAssetLink(props.original)} className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></button>,
            maxWidth: 100
        }]

        if (redirect) {
            return <Redirect to={redirectLink} />
        }

        return (
            <div>
                <h2>All Assets <span style={{ marginTop: '-10px' }} className='pull-right'><AssetFilter /></span></h2>
                <hr />
                {assets.length > 0 &&
                    <Table
                        data={assets}
                        columns={columns}
                        loading={false}
                        minRows={0}
                        pageSize={50}
                        showPageJump={false}
                        showPagination={assets > 50}
                        showPageSizeOptions={false}
                        noDataText=''
                        defaultSorted={[
                            {
                                id: 'count',
                                desc: true
                            }
                        ]}
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
                {assets.length == 0 &&
                    <Spinner notice='...loading assets...' />
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.taggableAssets,
        ...state.tags
    }),
    ({
        ...Ping.actionCreators,
        ...Assets.actionCreators,
        ...Tags.actionCreators
    })
)(AllAssets as any) as typeof AllAssets