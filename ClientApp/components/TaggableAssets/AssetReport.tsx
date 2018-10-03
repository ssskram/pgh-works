
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import { Redirect } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as Assets from '../../store/GETS/taggableAssets'
import * as Tags from '../../store/tags'
import * as Projects from '../../store/projects'
import * as Phases from '../../store/phases'
import Map from '../Maps/ProjectMap'
import StreetMap from '../Maps/StreetMap'
import inside from 'point-in-polygon'
import TagFilter from '../Filters/TagFilter'
import removeDuplicates from './../Functions/removeDuplicates'

const emptyNotice = {
    letterSpacing: '2px'
}

const marginTop = {
    marginTop: '25px'
}

export class AssetReport extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            redirect: false,
            redirectLink: '',
            assetName: '',
            assetType: '',
            assetShape: '',
            tags: []
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        if (this.props.match.params.id) {
            this.findAsset(this.props.match.params.id, false)
            this.findTags(this.props.match.params.id, false)
        }
        if (this.props.match.params.street) {
            this.findAsset(this.props.match.params.street, true)
            this.findTags(this.props.match.params.street, true)
        }
    }

    findAsset(prop, street) {
        if (street) {
            this.setState({
                assetName: prop,
                assetType: "Street"
            })
        } else {
            const asset = this.props.assets.find(function (asset) {
                return asset.assetOID == prop
            })
            this.setState({
                assetName: asset.assetName,
                assetType: asset.assetType,
                assetShape: asset.shape
            })
        }
    }

    findTags(props, street) {
        if (street) {
            const tags = this.props.tags.filter(tag => {
                return tag.taggedAssetName == props
            })
            var uniqueTags = removeDuplicates(tags, "parentID")
            this.setState({
                tags: uniqueTags
            })
        } else {
            const tags = this.props.tags.filter(tag => {
                return tag.taggedAssetOID == props
            })
            this.setState({
                tags: tags
            })
        }
    }

    filterTagsByStreetSegment(shape) {
        const allTags = this.props.tags.filter(tag => {
            return tag.taggedAssetName == this.props.match.params.street
        })
        let newTags = [] as any
        allTags.forEach(tag => {
            const asset = this.props.assets.find(asset => {
                return asset.assetOID == tag.taggedAssetOID
            })
            if (asset.shape) {
                asset.shape.points.forEach(function (point) {
                    const ins = inside([point.lat, point.lng], shape)
                    if (ins == true && !newTags.includes(tag)) {
                        newTags.push(tag)
                    }
                })
            }
        })
        var uniqueTags = removeDuplicates(newTags, "parentID")
        this.setState({
            tags: uniqueTags
        })
    }

    reset() {
        this.findAsset(this.props.match.params.street, true)
        this.findTags(this.props.match.params.street, true)
    }

    public render() {
        const {
            redirect,
            redirectLink,
            assetName,
            assetType,
            assetShape,
            tags
        } = this.state

        if (redirect) {
            <Redirect to={redirectLink} />
        }

        return (
            <div>
                <h2>{assetName}</h2>
                <h4><b>{assetType}</b></h4>
                <hr />
                {assetType != 'Street' &&
                    <div className='col-md-12'>
                        <Map shape={assetShape} />
                        <br />
                        <br />
                    </div>
                }
                {assetType == 'Street' &&
                    <div className='col-md-12'>
                        <StreetMap
                            street={assetName}
                            passShape={this.filterTagsByStreetSegment.bind(this)}
                            reset={this.reset.bind(this)}
                            assetName={assetName} />
                        <br />
                        <br />
                    </div>
                }
                <div className='col-md-8 col-md-offset-1'>
                    <h3>Related projects & phases <span style={{ marginTop: '-10px' }} className='pull-right'><TagFilter /></span></h3>
                    <hr />
                </div>
                {tags.length == 0 &&
                    <div className='col-md-12' style={{ margin: '50px 0px' }}>
                        <div className='text-center alert alert-info'>
                            <h2 style={emptyNotice} >No related projects or phases</h2>
                        </div>
                    </div>
                }
                {tags.length > 0 &&
                    tags.map((tag, index) =>
                        <div className='col-md-12' key={index}>
                            <div className='panel'>
                                <div className='panel-body text-center'>
                                    <div className='col-md-8'>
                                        <h3><b>{tag.parentName}</b></h3>
                                        <h4>{tag.parentType}</h4>
                                        <h4><i>"{tag.tagDescription}"</i></h4>
                                    </div>
                                    <div className='col-md-3'>
                                        <Link to={'/' + tag.parentType + '/id=' + tag.parentID} style={marginTop} className='btn btn-success'><span className='glyphicon glyphicon-arrow-right'></span></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.taggableAssets,
        ...state.tags,
        ...state.projects,
        ...state.phases
    }),
    ({
        ...Assets.actionCreators,
        ...Tags.actionCreators,
        ...Projects.actionCreators,
        ...Phases.actionCreators
    })
)(AssetReport as any) as typeof AssetReport