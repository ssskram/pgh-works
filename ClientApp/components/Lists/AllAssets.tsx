
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
import Spinner from '../Utilities/Spinner'
import Modal from 'react-responsive-modal'
import removeDuplicates from './../../functions/removeDuplicates'
import AssetMap from './../Maps/AssetMap'
import AssetTypeSelection from '../Filters/AssetTypeSelection'

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
            assetFilter: '',
            assets: [],
            modalIsOpen: false,
            currentPage: 1,
            redirectLink: '',
            redirect: false,
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        this.setAssets(this.props.assets)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps) {
            this.setAssets(nextProps.assets)
        }
    }

    setAssets(assets) {
        if (this.state.assetFilter != '') {
            // filter out duplicate streets
            var uniqueAssetNames = removeDuplicates(assets, "assetName").filter(asset => asset.assetType == this.state.assetFilter)
            uniqueAssetNames.forEach(item => {
                item.countReferences = this.returnCountTags(item)
            })
            this.setState({
                assets: uniqueAssetNames.filter(asset => asset.assetName != '').sort(function (a, b) {
                    return b.countReferences - a.countReferences
                })
            })
        }
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

    setAssetFilterType(type) {
        this.setState({ assetFilter: type }, function (this) {
            this.setAssets(this.props.assets)
        })
    }

    public render() {
        const {
            assetFilter,
            assets,
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
            const clearfix = index & 1 && index != 0
            return <div key={index}>
                <div className='col-xs-12 col-sm-6'>
                    <div className='panel panel-button'>
                        <div onClick={() => this.getAssetLink(asset)} className='panel-body text-center'>
                            <div style={padding15}>
                                <div className='col-md-12'>
                                    <h5>{asset.assetType}</h5>
                                    <h3><b>{asset.assetName}</b></h3>
                                    <h4><b>{asset.neighborhood}</b></h4>
                                    <h4>{asset.street}</h4>
                                    <h4>{asset.misc}</h4>
                                    <h4>Reference{asset.countReferences != 1 && 's'}: <b>{asset.countReferences}</b></h4>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {clearfix == true &&
                    <div className="clearfix"></div>
                }
            </div>
        })

        return (
            <div>
                <Hydrate />
                {this.props.assets.length == 0 &&
                    <Spinner
                        thirdNotice='...you can blame Cartegraph, if you would like...'
                        secondNotice='...sorry, this one takes a while...'
                        firstNotice='...loading the assets...'
                    />
                }
                {this.props.assets.length > 0 && assetFilter == '' &&
                    <Modal
                        open={assetFilter == ''}
                        onClose={() => { }}
                        classNames={{
                            overlay: 'custom-overlay',
                            modal: 'custom-modal'
                        }}
                        showCloseIcon={false}
                        center>
                        <div>
                            <AssetTypeSelection
                                receiveType={this.setAssetFilterType.bind(this)}
                                assetType={assetFilter} />
                        </div>
                    </Modal>
                }
                <div className='text-center'>
                    <h2><b>Assets</b></h2>
                    {assetFilter != '' &&
                        <button
                            onClick={() => this.setState({ assetFilter: '' })}
                            className='btn btn-secondary'>
                            <span style={{ letterSpacing: '2px', fontSize: '1.2em' }}>{assetFilter}</span>
                        </button>
                    }
                </div>
                <hr />
                {assetFilter != '' &&
                    <AssetMap
                        assets={assets}
                        redirect={this.getAssetLink.bind(this)} />
                }
                <br />
                <br />
                {assets.length > 0 &&
                    <div className='row'>
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
                {assets.length == 0 && assetFilter != '' &&
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