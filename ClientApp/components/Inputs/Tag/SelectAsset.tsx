// after asset type is selected, user is directed here to select asset from map
// or, if asset type == street, user must first select street name
// to render relevant segments

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../../store";
import * as Assets from "../../../store/GETS/taggableAssets";
import * as TagStore from "../../../store/tags";
import Select from "../../FormElements/select";
import SelectionMap from "../../Maps/ImportShapes";
import { StreetSelection } from "./StreetSelection";

export class SelectAsset extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      assets: [],
      assetDropdown: [],
      showMap: true,
      grabby: false,
      streetName: ""
    };
  }

  componentDidMount() {
    if (this.props.assetType == "Street") {
      this.setState({
        showMap: false
      });
    } else {
      // save list of assets to dropdown
      const assets = this.props.assets.filter(
        asset => asset.assetType == this.props.assetType
      );
      const assetSelects = [] as any;
      assets.forEach(asset => {
        const s = {
          value: asset.assetName,
          label: asset.assetName,
          name: "search"
        };
        assetSelects.push(s);
      });
      this.setState({
        assets: assets,
        assetDropdown: assetSelects
      });
    }
  }

  handleChildSelect(event) {
    this.setState({ [event.name]: event.value });
    this.filter(event.value);
  }

  filter(value) {
    var filteredAssets = this.state.assets.filter(asset =>
      asset.assetName.toLowerCase().includes(value.toLowerCase())
    );
    if (value != "") {
      this.setState({
        assets: filteredAssets
      });
    } else {
      this.setState({
        assets: this.props.assets.filter(
          asset => asset.assetType == this.props.assetType
        )
      });
    }
  }

  handleStreetSelection(streetName) {
    this.props.setStreetName(streetName);
    this.setState({
      assets: this.props.assets
        .filter(asset => asset.assetType == this.props.assetType)
        .filter(asset => asset.assetName == streetName.value),
      showMap: true,
      grabby: true,
      streetName: streetName.value
    });
  }

  public render() {
    const { assetType, back } = this.props;

    const {
      assets,
      assetDropdown,
      search,
      showMap,
      grabby,
      streetName
    } = this.state;

    var searchPlaceholder = "Search for " + assetType;

    return (
      <div>
        {showMap == true && (
          <div>
            <div className="col-md-12 text-center">
              <br />
              {grabby != true && <h3>Select {assetType}</h3>}
              {grabby == true && (
                <h3>Outline the relevant portion of {streetName}</h3>
              )}
            </div>
            {grabby != true && (
              <div className="col-md-12">
                <Select
                  value={search}
                  name="search"
                  header=""
                  placeholder={searchPlaceholder}
                  onChange={this.handleChildSelect.bind(this)}
                  multi={false}
                  options={assetDropdown}
                />
              </div>
            )}
            <div className="col-md-12 text-center">
              <SelectionMap
                assets={assets}
                receiveAsset={this.props.receiveAsset}
                grabby={grabby}
                passShape={this.props.receiveShape.bind(this)}
              />
            </div>
            <div className="col-md-12 text-center">
              <button onClick={back} className="btn btn-warning">
                Back
              </button>
            </div>
          </div>
        )}
        {showMap == false && (
          <StreetSelection
            assets={this.props.assets}
            returnStreet={this.handleStreetSelection.bind(this)}
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
    ...Assets.actionCreators,
    ...TagStore.actionCreators
  }
)(SelectAsset as any) as typeof SelectAsset;
