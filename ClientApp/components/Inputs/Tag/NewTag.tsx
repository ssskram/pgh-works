// parent container for new tag creation
// parent of SelectType.tsx
// parent of SelectAsset.tsx
// parent of TagDescription.tsx

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../store";
import * as Assets from "../../../store/GETS/taggableAssets";
import * as TagStore from "../../../store/tags";
import SelectType from "./SelectType";
import SelectAsset from "./SelectAsset";
import DescribeTag from "./TagDescription";
import { v1 as uuid } from "uuid";
import assetsInPolygon from "./../../../functions/assetsInPolygon";

export class TaggableAssetSelection extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      parentComponent: props.parent,
      assetType: "",

      // for tag generation
      tagDescription: false,
      // single asset
      selectedAsset: {},
      // or shape to capture multiple street segments
      selectedShape: [],
      streetName: ""
    };
  }

  back() {
    this.setState({
      assetType: "",
      tagDescription: false,
      selectedAsset: {},
      selectedShape: {}
    });
  }

  receiveType(type) {
    this.setState({
      assetType: type
    });
  }

  receiveAsset(asset) {
    if (this.state.parentComponent == "asset") {
      this.setState({
        tagDescription: true,
        selectedAsset: asset
      });
    } else {
      this.props.receiveAsset(asset);
    }
  }

  setStreetName(streetName) {
    this.setState({
      streetName: streetName.value
    });
  }

  receiveShape(shape) {
    this.setState({
      selectedShape: shape,
      tagDescription: true
    });
  }

  receiveDescription(tag) {
    this.props.receiveTag(tag);
  }

  generateTags(description) {
    let self = this;
    const streetSegments = this.props.assets.filter(function(asset) {
      return asset.assetName == self.state.streetName;
    });
    // for each street segment within shape, generate it's own tag
    const componentAssets = assetsInPolygon(
      this.state.selectedShape.points,
      streetSegments
    );
    if (componentAssets.length > 0) {
      componentAssets.forEach(function(asset) {
        self.createTag(asset, description);
      });
    }
  }

  createTag(asset, description) {
    const guid: string = uuid();
    let tagLoad = {
      tagID: guid,
      parentID: this.props.parentID,
      parentType: this.props.parentType,
      parentName: this.props.parentName,
      taggedAssetOID: asset.assetOID,
      taggedAssetName: asset.assetName,
      tagType: asset.assetType,
      tagDescription: description
    };
    this.props.addTag(tagLoad);
    this.props.closeModal();
  }

  public render() {
    const {
      parentComponent,
      assetType,
      tagDescription,
      selectedAsset,
      selectedShape
    } = this.state;

    return (
      <div>
        {assetType == "" && (
          <SelectType
            parentComponent={parentComponent}
            receiveType={this.receiveType.bind(this)}
          />
        )}
        {assetType != "" && tagDescription == false && (
          <SelectAsset
            assetType={assetType}
            receiveAsset={this.receiveAsset.bind(this)}
            back={this.back.bind(this)}
            receiveShape={this.receiveShape.bind(this)}
            setStreetName={this.setStreetName.bind(this)}
          />
        )}
        {tagDescription == true && Object.keys(selectedAsset).length > 0 && (
          <DescribeTag
            asset={selectedAsset}
            receiveDescription={this.receiveDescription.bind(this)}
            back={this.back.bind(this)}
          />
        )}
        {tagDescription == true && Object.keys(selectedShape).length > 0 && (
          <DescribeTag
            shape={selectedShape}
            receiveDescription={this.generateTags.bind(this)}
            back={this.back.bind(this)}
          />
        )}
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.taggableAssets,
    ...state.tags
  }),
  {
    ...TagStore.actionCreators,
    ...Assets.actionCreators
  }
)(TaggableAssetSelection as any) as typeof TaggableAssetSelection;
