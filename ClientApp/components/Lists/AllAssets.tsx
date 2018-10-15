
import * as React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { ApplicationState } from '../../store'
import Hydrate from './../Utilities/HydrateStore'
import * as Ping from '../../store/GETS/ping'
import * as Assets from '../../store/GETS/taggableAssets'
import * as Tags from '../../store/tags'
import Paging from '../Utilities/Paging'
import { returnPageNumber, returnCurrentItems } from './../../functions/paging'
import AssetFilter from './../Filters/AssetFilter'
import Spinner from '../Utilities/Spinner'
import removeDuplicates from './../../functions/removeDuplicates'
import returnAssetIcon from './../../functions/getAssetIcon'

const imgHeight = {
    height: '50px'
}

const padding15 = {
    padding: '15px'
}

const emptyNotice = {
    letterSpacing: '2px'
}

export class AllAssets extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            assets: [],
            currentPage: 1,
            redirectLink: '',
            redirect: false,
            onFilter: false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        this.setAssets(this.props.assets)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps && this.state.onFilter == false) {
            this.setAssets(nextProps.assets)
        }
    }

    setAssets(assets) {
        // filter out duplicate streets
        var uniqueAssetNames = removeDuplicates(assets, "assetName")
        uniqueAssetNames.forEach(item => {
            item.countReferences = this.returnCountTags(item)
        })
        this.setState({
            assets: uniqueAssetNames.filter(asset => asset.assetName != '').sort(function (a, b) {
                return b.countReferences - a.countReferences
            })
        })
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
            // filter out duplicate streets
            var uniqueTags = removeDuplicates(relevantTags, "parentID")
            return uniqueTags.length
        }
    }

    handleNextClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current + 1
        });
    }

    handlePreviousClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current - 1
        });
    }

    receiveFilteredAssets(assets) {
        this.setState({
            onFilter: true
        }, function (this) {
            this.setAssets(assets)
        })
    }

    public render() {
        const {
            assets,
            onFilter,
            redirectLink,
            redirect,
            currentPage
        } = this.state

        if (redirect) {
            return <Redirect push to={redirectLink} />
        }

        const currentItems = returnCurrentItems(assets, currentPage)
        const pageNumbers = returnPageNumber(assets)
        const renderItems = currentItems.map((asset, index) => {
            const src = returnAssetIcon(asset.assetType)
            return <div className='col-md-12' key={index}>
                <div className='panel'>
                    <div className='panel-body text-center'>
                        <div className='col-md-2'>
                            <img src={src} style={imgHeight} />
                            <h4><b>{asset.assetType}</b></h4>
                        </div>
                        <div style={padding15}>
                            <div className='col-md-5'>
                                <h3><b>{asset.assetName}</b></h3>
                                <h4>Cartegraph ID: <b>{asset.assetOID}</b></h4>
                            </div>
                            <div className='col-md-3'>
                                <div className='hidden-sm hidden-xs'>
                                    <h3><b>{asset.countReferences}</b></h3>
                                    <h4>Reference{asset.countReferences != 1 && 's'}</h4>
                                </div>
                                <div className='hidden-md hidden-lg hidden-xl'>
                                    <h4>Reference{asset.countReferences != 1 && 's'}: <b>{asset.countReferences}</b></h4>
                                </div>
                            </div>
                            <div className='col-md-2'>
                                <button onClick={() => this.getAssetLink(asset)} className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        })

        return (
            <div>
                <Hydrate />
                {assets.length == 0 && onFilter == false &&
                    <Spinner notice='...loading the assets...' />
                }
                <h2>
                    All Assets
                    <span style={{ marginTop: '-5px' }} className='pull-right'>
                        <AssetFilter
                            returnFiltered={this.receiveFilteredAssets.bind(this)} />
                    </span>
                </h2>
                <hr />
                {assets.length > 0 &&
                    <div className='col-md-12'>
                        {renderItems}
                        <br />
                        <br />
                        <Paging
                            count={assets}
                            currentPage={currentPage}
                            totalPages={pageNumbers}
                            next={this.handleNextClick.bind(this)}
                            prev={this.handlePreviousClick.bind(this)} />
                        <br />
                        <br />
                    </div>
                }
                {assets.length == 0 && onFilter == true &&
                    <div className='col-md-12' style={{ margin: '20px 0px' }}>
                        <div className='text-center alert alert-info'>
                            <h2 style={emptyNotice}>No assets matching those criteria</h2>
                        </div>
                    </div>
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