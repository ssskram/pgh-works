// returns all tags of relevant assets per project/phase

import * as React from "react";
import { connect } from "react-redux";
import { ApplicationState } from "../../store";
import * as TagStore from "../../store/tags";
import Modal from "react-responsive-modal";
import TagInput from "../Inputs/Tag/Tag";
import TagCard from "../Cards/TagCard";
import { v1 as uuid } from "uuid";
import removeDuplicates from "../../functions/removeDuplicates";

const tagImg = require("./../../images/tag.png");

const iconStyle = {
  marginRight: "14px",
  marginTop: "-8px",
  height: "38px"
};

export class Tags extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      // utilities
      modalIsOpen: false,

      // tags
      tags: []
    };
    this.getTags = this.getTags.bind(this);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.getTags(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getTags(nextProps);
  }

  getTags(props) {
    if (props.tags) {
      let tags = props.tags.filter(function(item) {
        return item.parentID == props.parentID;
      });
      // take unique to prohibit duplicate street segments
      const unique = removeDuplicates(tags, "taggedAssetName");
      if (tags.length > 0) {
        this.setState({
          tags: unique
        });
      }
    }
  }

  postTag(tag) {
    const guid: string = uuid();
    let tagLoad = {
      tagID: guid,
      parentID: this.props.parentID,
      parentType: this.props.parentType,
      parentName: this.props.parentName,
      taggedAssetOID: tag.taggedAssetOID,
      taggedAssetName: tag.taggedAssetName,
      tagType: tag.tagType,
      tagDescription: tag.tagDescription
    };
    this.props.addTag(tagLoad);
    this.setState({
      modalIsOpen: false
    });
  }

  closeModal() {
    this.setState({
      modalIsOpen: false
    });
  }

  openModal() {
    this.setState({
      modalIsOpen: true
    });
  }

  removeTag(tag) {
    // removes tag locally from state
    // done in step with mutable delete from redux store
    const tagsCopy = this.state.tags.slice();
    tagsCopy.splice(tagsCopy.indexOf(tag), 1);
    this.setState({
      tags: tagsCopy
    });
  }

  public render() {
    const { modalIsOpen, tags } = this.state;

    const { canEdit } = this.props;
    return (
      <div className="row">
        <h2>
          <img style={iconStyle} src={tagImg as string} />
          Relevant Assets
          {canEdit && (
            <span>
              <div
                onClick={this.openModal.bind(this)}
                title="Tag an asset"
                className="btn-add pull-right hidden-xs"
              >
                <span
                  style={{ marginTop: "10px" }}
                  className="glyphicon glyphicon-plus"
                />
              </div>
            </span>
          )}
        </h2>
        <hr />
        <div className="col-md-12 row">
          {tags.length == 0 && (
            <h4 className="text-center">
              <i>No relevant assets</i>
            </h4>
          )}
          {tags.length > 0 &&
            tags.map((tag, index) => {
              return (
                <TagCard
                  canEdit={canEdit}
                  tag={tag}
                  key={tag.tagID}
                  removeTag={this.removeTag.bind(this)}
                  index={index}
                />
              );
            })}
        </div>
        <Modal
          open={modalIsOpen}
          onClose={this.closeModal.bind(this)}
          classNames={{
            overlay: "custom-overlay",
            modal: "custom-modal"
          }}
          center
        >
          <TagInput
            postTag={this.postTag.bind(this)}
            parentName={this.props.parentName}
            parentID={this.props.parentID}
            parentType={this.props.parentType}
            closeModal={this.closeModal.bind(this)}
          />
        </Modal>
      </div>
    );
  }
}

export default connect(
  (state: ApplicationState) => ({
    ...state.tags
  }),
  {
    ...TagStore.actionCreators
  }
)(Tags as any) as typeof Tags;
