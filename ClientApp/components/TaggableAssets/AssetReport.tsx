
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import { Redirect } from 'react-router-dom'
import Table from 'react-table'
import * as Assets from '../../store/GETS/taggableAssets'
import * as Tags from '../../store/tags'
import * as Projects from '../../store/projects'
import * as Phases from '../../store/phases'
import Map from '../Map/ProjectMap'
import StreetMap from '../Map/StreetMap'

const iconStyle = {
    color: '#fff',
    marginTop: '-5px',
    paddingRight: '15px',
    paddingLeft: '15px'
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
        if (this.props.match.params.id) {
            this.findAsset(this.props.match.params.id, false)
            this.findTags(this.props.match.params.id, false)
        }
        if (this.props.match.params.street) {
            this.findAsset(this.props.match.params.street, true)
            this.findTags(this.props.match.params.street, true)
        }
    }

    componentWillReceiveProps(nextProps) {

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
                assetShape: asset.shape.points
            })
        }
    }

    findTags(props, street) {
        if (street) {

        }
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
                    <Map shape={assetShape} />
                }
                {assetType == 'Street' &&
                    <StreetMap street={assetName}/>
                }
                {tags.length == 0 &&
                    <div className='col-md-12 text-center'>
                        <br />
                        <br />
                        <h1><span><img style={iconStyle} src='./images/nothing.png' /></span></h1>
                        <h2><i>{assetName} is not related to any project or phase</i></h2>
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