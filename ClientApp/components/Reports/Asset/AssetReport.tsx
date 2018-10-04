
// returns asset on map
// and then returns all projects/phases that have tagged asset

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import { Redirect } from 'react-router-dom'
import Spinner from '../../Utilities/Spinner'
import { Link } from 'react-router-dom'
import * as Assets from '../../../store/GETS/taggableAssets'
import * as Tags from '../../../store/tags'
import * as Projects from '../../../store/projects'
import * as Phases from '../../../store/phases'
import Map from '../../Maps/ProjectMap'
import StreetMap from '../../Maps/StreetMap'
import TagFilter from '../../Filters/TagFilter'
import removeDuplicates from '../../../functions/removeDuplicates'
import assetsInPolygon from '../../../functions/assetsInPolygon'
import Hydrate from './../../Utilities/HydrateStore'

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
            spinner: true,
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
        if (this.props.assets.length > 0 && this.props.tags.length > 0) {
            if (this.props.match.params.id) {
                this.findAsset(this.props.match.params.id, this.props.assets, false)
                this.findTags(this.props.match.params.id, this.props.tags, false)
            }
            if (this.props.match.params.street) {
                this.findAsset(this.props.match.params.street, this.props.assets, true)
                this.findTags(this.props.match.params.street, this.props.tags, true)
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.assets.length > 0 && nextProps.tags.length > 0) {
            if (this.props.match.params.id) {
                this.findAsset(this.props.match.params.id, nextProps.assets, false)
                this.findTags(this.props.match.params.id, nextProps.tags, false)
            }
            if (this.props.match.params.street) {
                this.findAsset(this.props.match.params.street, nextProps.assets, true)
                this.findTags(this.props.match.params.street, nextProps.tags, true)
            }
        }
    }

    findAsset(prop, assets, street) {
        if (street) {
            this.setState({
                assetName: prop,
                assetType: "Street"
            })
        } else {
            const asset = assets.find(function (asset) {
                return asset.assetOID == prop
            })
            this.setState({
                assetName: asset.assetName,
                assetType: asset.assetType,
                assetShape: asset.shape
            })
        }
    }

    findTags(props, tags, street) {
        if (street) {
            const allTags = tags.filter(tag => {
                return tag.taggedAssetName == props
            })
            const uniqueTags = removeDuplicates(allTags, "parentID")
            this.setState({
                tags: uniqueTags,
                spiner: false
            })
        } else {
            const allTags = tags.filter(tag => {
                return tag.taggedAssetOID == props
            })
            this.setState({
                tags: allTags,
                spinner: false
            })
        }
    }

    filterTagsByStreetSegment(shape) {
        const allTags = this.props.tags.filter(tag => {
            return tag.taggedAssetName == this.props.match.params.street
        })
        const newTags = assetsInPolygon(shape, allTags)
        const uniqueTags = removeDuplicates(newTags, "parentID")
        this.setState({
            tags: uniqueTags
        })
    }

    reset() {
        this.findAsset(this.props.match.params.street, this.props.assets, true)
        this.findTags(this.props.match.params.street, this.props.tags, true)
    }

    getProject(phaseID) {
        let phase = this.props.phases.find(phase => {
            return phase.phaseID == phaseID
        })
        let project = this.props.projects.find(project => {
            return project.projectID == phase.projectID
        })
        return project.projectName
    }

    public render() {
        const {
            spinner,
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
                <Hydrate />
                {spinner == true &&
                    <Spinner notice='...loading the asset report...' />
                }
                {spinner == false &&
                    <div>
                        <div className='text-center'>
                            <h1>{assetName}</h1>
                            <h3><b>{assetType}</b></h3>
                        </div>
                        <br />
                        <br />
                        {assetType != 'Street' &&
                            <div className='col-md-12'>
                                <Map shape={assetShape} asset/>
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
                        <div className='col-md-12'>
                            <h3>Related projects & phases <span style={{ marginTop: '-5px' }} className='pull-right'><TagFilter /></span></h3>
                            <hr />
                        </div>
                        {tags.length == 0 &&
                            <div className='col-md-12' style={{ margin: '20px 0px' }}>
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
                                            <div className='col-md-3'>
                                                {tag.parentType == 'Project' &&
                                                    <div>
                                                        <img src='./images/project.png'></img>
                                                        <div><h4><b>{tag.parentType}</b></h4></div>
                                                    </div>
                                                }
                                                {tag.parentType == 'Phase' &&
                                                    <div>
                                                        <img src='./images/phaseGrey.png'></img>
                                                        <div><h4><b>{tag.parentName}</b></h4></div>
                                                    </div>
                                                }
                                            </div>
                                            <div style={{ paddingTop: '15px' }} className='col-md-6'>
                                                {tag.parentType == "Project" &&
                                                    <h3><b>{tag.parentName}</b></h3>
                                                }
                                                {tag.parentType == "Phase" &&
                                                    <h3><b>{this.getProject(tag.parentID)}</b></h3>
                                                }
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