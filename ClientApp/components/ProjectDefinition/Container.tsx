
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/GETS/ping'
import * as User from '../../store/GETS/user'
import * as Projects from '../../store/projects'
import * as Assets from '../../store/GETS/taggableAssets'
import * as TagStore from '../../store/tags'
import Geolocate from './Geolocate/Geolocate'
import ProjectDescription from './Description/Description'
import Map from '../Map/ProjectMap'
import * as moment from 'moment'
import { v1 as uuid } from 'uuid'
import inside from 'point-in-polygon'

export class ProjectDefinition extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            // utilities
            step: 1,
            redirect: false,

            // project state
            projectID: '',
            shape: [],
            projectName: '',
            expectedStartDate: '',
            expectedEndDate: '',
            actualStartDate: '',
            actualEndDate: '',
            projectManager: '',
            projectMembers: '',
            projectDepartment: '',
            projectDescription: '',
            projectStatus: '',
            notes: '',
            created: moment().format('MM/DD/YYYY'),
            createdBy: props.user,
            lastModifiedBy: props.user
        }
    }

    componentDidMount() {
        // ping server
        this.props.ping()

        // generate uuid for projectID
        const guid: string = uuid()
        this.setState({
            projectID: guid
        })
    }

    setShape(shape) {
        this.setState({
            shape: shape
        })
    }

    setName(name) {
        this.setState({
            projectName: name
        })
    }

    next() {
        this.setState({
            step: this.state.step + 1
        })
    }

    back() {
        this.setState({
            step: this.state.step - 1
        })
    }

    post(projectDesc) {
        this.setState({
            projectName: projectDesc.projectName,
            expectedStartDate: projectDesc.expectedStartDate,
            expectedEndDate: projectDesc.expectedEndDate,
            actualStartDate: projectDesc.actualStartDate,
            actualEndDate: projectDesc.actualEndDate,
            projectManager: projectDesc.projectManager,
            projectMembers: projectDesc.projectMembers,
            projectDepartment: projectDesc.projectDepartment,
            projectDescription: projectDesc.projectDescription,
            projectStatus: projectDesc.projectStatus,
            notes: projectDesc.notes
        }, function (this) {
            // add to project store 
            this.props.addProject(this.state)
            this.pointsInPolygon()
        })
        this.setState({
            redirect: true
        })
    }

    pointsInPolygon () {
        const self = this
        let shape = [] as any
        let componentAssets = [] as any
        this.state.shape.forEach(function (point) {
            const shapeArray = [ point.lat, point.lng]
            shape.push(shapeArray)
        })
        this.props.assets.forEach(function(asset) {
            if (asset.shape) {
                asset.shape.points.forEach(function(point) {
                    const ins = inside([ point.lat, point.lng], shape)
                    if (ins == true && !componentAssets.includes(asset)) {
                        componentAssets.push(asset)
                    }
                })
            }
        })
        if (componentAssets.length > 0) {
            componentAssets.forEach(function (component) {
                self.createTag (component)
            })
        }
    }

    createTag (asset) {
        const guid: string = uuid()
        let tagLoad = {
            tagID: guid,
            parentID: this.state.projectID,
            parentType: 'Project',
            parentName: this.state.projectName,
            taggedAssetOID: asset.assetOID,
            taggedAssetName: asset.assetName,
            dateCreated: moment().format('MM/DD/YYYY'),
            tagType: asset.assetType,
            tagDescription: 'Within project bounds',
        }
        this.props.addTag(tagLoad)
    } 

    public render() {
        const {
            step,
            redirect,
            projectID,
            shape,
        } = this.state

        const link = "/Project/id=" + projectID

        if (redirect) {
            return <Redirect to={link} />
        }

        return (
            <div>
                <h2>
                    <span>New project</span>
                    <b>
                        {step == 1 &&
                            <span className='pull-right'><span className='glyphicon glyphicon-map-marker nav-glyphicon hidden-xs'></span>Location</span>
                        }
                        {step == 2 &&
                            <span className='pull-right'><span className='glyphicon glyphicon-info-sign nav-glyphicon hidden-xs'></span>Description</span>
                        }
                    </b>
                </h2>
                <hr />
                <div>
                    {step == 1 &&
                        <Geolocate
                            next={this.next.bind(this)}
                            setShape={this.setShape.bind(this)}
                            shape={shape}
                        />
                    }
                    {step == 2 &&
                    <div>
                        <Map shape={shape} />
                        <br/>
                        <ProjectDescription
                            back={this.back.bind(this)}
                            post={this.post.bind(this)}
                            shape={shape}
                        />
                    </div>
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.user,
        ...state.projects,
        ...state.taggableAssets,
        ...state.tags
    }),
    ({
        ...Ping.actionCreators,
        ...User.actionCreators,
        ...Projects.actionCreators,
        ...Assets.actionCreators,
        ...TagStore.actionCreators
    })
)(ProjectDefinition as any) as typeof ProjectDefinition