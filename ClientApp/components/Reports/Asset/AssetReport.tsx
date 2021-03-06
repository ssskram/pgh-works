// returns asset on map
// and then returns all projects/phases that have tagged asset

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../store";
import { Redirect } from "react-router-dom";
import Spinner from "../../Utilities/Spinner";
import { Link } from "react-router-dom";
import * as Assets from "../../../store/GETS/taggableAssets";
import * as Tags from "../../../store/tags";
import * as Projects from "../../../store/projects";
import * as Phases from "../../../store/phases";
import Map from "../../Maps/ProjectMap";
import StreetMap from "../../Maps/StreetMap";
import TagFilter from "../../Filters/TagFilter";
import removeDuplicates from "../../../functions/removeDuplicates";
import assetsInPolygon from "../../../functions/assetsInPolygon";
import Hydrate from "./../../Utilities/HydrateStore";

const projectImg = require("./../../../images/project.png");
const phaseImg = require("./../../../images/phaseGrey.png");

const emptyNotice = {
  letterSpacing: "2px"
};

export class AssetReport extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      spinner: true,
      onFilter: false,
      redirect: false,
      redirectLink: "",
      assetName: "",
      assetType: "",
      assetShape: "",
      neighborhood: "",
      street: "",
      misc: "",
      // because incoming tags are manipulated so much,
      // cache the original array returned from processing
      // to return to on filter clear
      tagsImmutable: [],
      tags: []
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    if (this.props.assets.length > 0 && this.props.tags.length > 0) {
      if (this.props.match.params.id) {
        this.findAsset(this.props.match.params.id, this.props.assets, false);
        this.findTags(this.props.match.params.id, this.props.tags, false);
      }
      if (this.props.match.params.street) {
        this.findAsset(this.props.match.params.street, this.props.assets, true);
        this.findTags(this.props.match.params.street, this.props.tags, true);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.assets.length > 0 &&
      nextProps.tags.length > 0 &&
      this.state.onFilter == false
    ) {
      if (this.props.match.params.id) {
        this.findAsset(this.props.match.params.id, nextProps.assets, false);
        this.findTags(this.props.match.params.id, nextProps.tags, false);
      }
      if (this.props.match.params.street) {
        this.findAsset(this.props.match.params.street, nextProps.assets, true);
        this.findTags(this.props.match.params.street, nextProps.tags, true);
      }
    }
  }

  findAsset(prop, assets, street) {
    if (street) {
      this.setState({
        assetName: prop,
        assetType: "Street"
      });
    } else {
      const asset = assets.find(function(asset) {
        return asset.assetOID == prop;
      });
      this.setState({
        assetName: asset.assetName,
        assetType: asset.assetType,
        assetShape: asset.shape,
        neighborhood: asset.neighborhood,
        street: asset.street,
        misc: asset.misc
      });
    }
  }

  findTags(props, tags, street) {
    if (street) {
      const allTags = tags.filter(tag => {
        return tag.taggedAssetName == props;
      });
      const uniqueTags = removeDuplicates(allTags, "parentID");
      this.setState({
        tags: uniqueTags,
        tagsImmutable: uniqueTags,
        spinner: false
      });
    } else {
      const allTags = tags.filter(tag => {
        return tag.taggedAssetOID == props;
      });
      this.setState({
        tags: allTags,
        tagsImmutable: allTags,
        spinner: false
      });
    }
  }

  filterTagsByStreetSegment(shape) {
    // empty array to push tagged street segments
    let assets = [] as any;
    // get all tags by street name
    const allTags = this.props.tags.filter(tag => {
      return tag.taggedAssetName == this.props.match.params.street;
    });
    // for each tag, push the corresponding asset to array
    allTags.forEach(tag => {
      const taggedAsset = this.props.assets.find(asset => {
        return asset.assetOID == tag.taggedAssetOID;
      });
      assets.push(taggedAsset);
    });
    // get assets within the shape
    const assetsInside = assetsInPolygon(shape, assets);
    // empty array to push corresponding tags on assetsInside
    let newTags = [] as any;
    // for each asset inside, get the corresponding tags
    assetsInside.forEach(asset => {
      this.props.tags.filter(tag => {
        if (tag.taggedAssetOID == asset.assetOID) {
          newTags.push(tag);
        }
      });
    });
    const uniqueTags = removeDuplicates(newTags, "parentID");
    this.setState({
      tags: uniqueTags
    });
  }

  reset() {
    this.setState({
      tags: this.state.tagsImmutable,
      onFilter: false
    });
  }

  getProject(phaseID) {
    let phase = this.props.phases.find(phase => {
      return phase.phaseID == phaseID;
    });
    let project = this.props.projects.find(project => {
      return project.projectID == phase.projectID;
    });
    return project.projectName;
  }

  receiveFilteredTags(tags) {
    this.setState({
      tags: tags,
      onFilter: true
    });
  }

  public render() {
    const {
      spinner,
      onFilter,
      redirect,
      redirectLink,
      assetName,
      assetType,
      assetShape,
      neighborhood,
      street,
      misc,
      tags
    } = this.state;

    if (redirect) {
      <Redirect push to={redirectLink} />;
    }

    return (
      <div>
        {spinner == true && (
          <Spinner
            firstNotice="...loading the asset report..."
            thirdNotice="...you can blame Cartegraph, if you would like..."
            secondNotice="...sorry, this one takes a while..."
          />
        )}
        {spinner == false && (
          <div>
            <div className="text-center">
              <h3>{assetType}</h3>
              <h1>{assetName}</h1>
              <h4>{neighborhood}</h4>
              <h4>{street}</h4>
              <h4>{misc}</h4>
            </div>
            <br />
            <br />
            {assetType != "Street" && (
              <div className="col-md-12">
                <Map shape={assetShape} asset />
                <br />
                <br />
              </div>
            )}
            {assetType == "Street" && (
              <div className="col-md-12">
                <StreetMap
                  street={assetName}
                  passShape={this.filterTagsByStreetSegment.bind(this)}
                  reset={this.reset.bind(this)}
                  assetName={assetName}
                />
                <br />
                <br />
              </div>
            )}
            <div className="col-md-12">
              <h3 className="hidden-xs">
                Related projects & phases
                <span style={{ marginTop: "-20px" }} className="pull-right">
                  <TagFilter
                    tags={tags}
                    reset={this.reset.bind(this)}
                    returnFiltered={this.receiveFilteredTags.bind(this)}
                  />
                </span>
              </h3>
              <h3 className="hidden-sm hidden-md hidden-lg hidden-xl text-center">
                Related projects & phases
                <div className="col-md-12" style={{ paddingTop: "15px" }}>
                  <span>
                    <TagFilter
                      tags={tags}
                      reset={this.reset.bind(this)}
                      returnFiltered={this.receiveFilteredTags.bind(this)}
                    />
                  </span>
                </div>
              </h3>
              <hr />
            </div>
            {tags.length == 0 && (
              <div className="col-md-12" style={{ margin: "20px 0px" }}>
                <div className="text-center alert alert-info">
                  {onFilter == false && (
                    <h2 style={emptyNotice}>No related projects or phases</h2>
                  )}
                  {onFilter == true && (
                    <h2 style={emptyNotice}>Nothing matches those criteria</h2>
                  )}
                </div>
              </div>
            )}
            {tags.length > 0 &&
              tags.map((tag, index) => (
                <div className="col-md-12" key={index}>
                  <div className="panel panel-button">
                    <Link to={"/" + tag.parentType + "/id=" + tag.parentID}>
                      <div className="panel-body text-center">
                        <div className="col-md-4">
                          {tag.parentType == "Project" && (
                            <div>
                              <div className="panel-img-container">
                                <span className="panel-img-helper" />
                                <img src={projectImg as string} />
                              </div>
                            </div>
                          )}
                          {tag.parentType == "Phase" && (
                            <div>
                              <div className="panel-img-container">
                                <span className="panel-img-helper" />
                                <img src={phaseImg as string} />
                              </div>
                            </div>
                          )}
                        </div>
                        <div
                          style={{ paddingTop: "15px" }}
                          className="col-md-8"
                        >
                          {tag.parentType == "Project" && (
                            <div>
                              <h3>
                                <b>{tag.parentName}</b>
                              </h3>
                              <div>
                                <h4>{tag.parentType}</h4>
                              </div>
                            </div>
                          )}
                          {tag.parentType == "Phase" && (
                            <div>
                              <h3>
                                <b>{this.getProject(tag.parentID)}</b>
                              </h3>
                              <div>
                                <h4>
                                  <b>{tag.parentName}</b>
                                </h4>
                              </div>
                            </div>
                          )}
                          <h4>
                            <i>"{tag.tagDescription}"</i>
                          </h4>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
        <Hydrate />
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.taggableAssets,
    ...state.tags,
    ...state.projects,
    ...state.phases
  }),
  {
    ...Assets.actionCreators,
    ...Tags.actionCreators,
    ...Projects.actionCreators,
    ...Phases.actionCreators
  }
)(AssetReport as any) as typeof AssetReport;
