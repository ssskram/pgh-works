
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
import Select from '../FormElements/select'

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
            assetDropdown: [],
            assetType: '',
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
        if (this.props != nextProps && this.state.assetFilter == '') {
            this.setAssets(nextProps.assets)
        }
    }

    setAssets(assets) {
        if (this.state.assetType != '') {
            // filter out duplicate streets
            var uniqueAssetNames = removeDuplicates(assets, "assetName").filter(asset => asset.assetType == this.state.assetType)
            uniqueAssetNames.forEach(item => {
                item.countReferences = this.returnCountTags(item)
            })
            this.setState({
                assets: uniqueAssetNames.filter(asset => asset.assetName != '').sort(function (a, b) {
                    return b.countReferences - a.countReferences
                })
            }, function (this) {
                let selects = [] as any
                this.state.assets.forEach(asset => {
                    const select = { value: asset.assetName, label: asset.assetName, name: 'assetFilter' }
                    selects.push(select)
                })
                this.setState({
                    assetDropdown: selects
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

    setAssetType(type) {
        this.setState({ assetType: type }, function (this) {
            this.setAssets(this.props.assets)
        })
    }

    filter(event) {
        this.setState({ [event.name]: event.value });
        const asset = this.state.assets.filter(asset => asset.assetName == event.value)
        this.setState({ assets: asset })
    }

    clearFilter() {
        this.setState({
            assetFilter: ''
        })
        this.setAssets(this.props.assets)
    }

    public render() {
        const {
            assetFilter,
            assetType,
            assetDropdown,
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
                {this.props.assets.length > 0 && assetType == '' &&
                    <Modal
                        open={assetType == ''}
                        onClose={() => { }}
                        classNames={{
                            overlay: 'custom-overlay',
                            modal: 'custom-modal'
                        }}
                        showCloseIcon={false}
                        center>
                        <div>
                            <AssetTypeSelection
                                receiveType={this.setAssetType.bind(this)}
                            />
                        </div>
                    </Modal>
                }
                <div className='text-center'>
                    <h2><b>Assets</b></h2>
                    {assetType != '' &&
                        <button
                            onClick={() => this.setState({ assetType: '' })}
                            className='btn btn-secondary'>
                            <span style={{ letterSpacing: '2px', fontSize: '1.2em' }}>{assetType}</span>
                        </button>
                    }
                </div>
                <hr />
                <div className='row'>
                    <div className='col-md-12'>
                        <Select
                            value={assetFilter}
                            name="assetFilter"
                            header={"Search for " + assetType}
                            placeholder='Search by name...'
                            onChange={this.filter.bind(this)}
                            multi={false}
                            options={assetDropdown}
                        />
                        {assetFilter != '' &&
                            <div className='text-center'>
                                <button style={{ width: '80%', margin: '0 auto' }} onClick={this.clearFilter.bind(this)} className='btn btn-warning'>Clear</button>
                            </div>
                        }
                    </div>
                </div>
                {assetType != '' && assetType != 'Street' &&
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
                {assets.length == 0 && assetType != '' &&
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