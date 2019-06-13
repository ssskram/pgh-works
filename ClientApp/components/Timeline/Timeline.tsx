// core timeline component

import * as React from "react";
import TL from "react-visjs-timeline";
import Modal from "react-responsive-modal";

export default class Line extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      items: [],
      selectedItem: {},
      investigate: false,
      scroll: false
    };
    this.redraw = this.redraw.bind(this);
  }

  componentWillMount() {
    let self = this;
    this.redraw(this.props);
    // I know, it's crazy
    // but the timeline doesn't like rendering when it's supposed to
    // so I call it up a second time and it always works
    setTimeout(function() {
      self.forceUpdate();
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.redraw(nextProps);
  }

  redraw(props) {
    this.setState({
      groups: props.groups,
      items: props.items
    });
  }

  clickHandler(props) {
    const item = this.state.items.find(it => it.id == props.item);
    if (item) {
      this.setState({ selectedItem: item, investigate: true });
    }
  }

  public render() {
    const { groups, items, selectedItem, investigate, scroll } = this.state;

    const timelineOptions = {
      width: "100%",
      stack: true,
      autoResize: true,
      showMajorLabels: true,
      showCurrentTime: true,
      zoomMin: 1000000,
      orientation: "top",
      zoomable: scroll,
      format: {
        minorLabels: {
          minute: "h:mma",
          hour: "ha"
        }
      }
    };

    return (
      <div>
        <button
          onClick={() => this.setState({ scroll: !scroll })}
          style={{
            backgroundColor: "#383838",
            color: "#fff",
            marginTop: "-35px"
          }}
          className="btn btn-dark pull-right"
        >
          {scroll ? "Disable zoom" : "Enable zoom"}
        </button>
        <TL
          options={timelineOptions}
          items={items}
          groups={groups}
          clickHandler={this.clickHandler.bind(this)}
        />
        <Modal
          open={investigate}
          onClose={() =>
            this.setState({
              investigate: false,
              selectedItem: {}
            })
          }
          classNames={{
            overlay: "custom-overlay",
            modal: "custom-modal"
          }}
          center
        >
          <div className="col-md-12">
            {selectedItem && selectedItem.itemType == "projectExpected" && (
              <div className="text-center">
                <i>Project</i>
                <h4>Expected start date</h4>
                <h4>
                  <b>{selectedItem.start}</b>
                </h4>
                <h4>Expected end date</h4>
                <h4>
                  <b>{selectedItem.end}</b>
                </h4>
              </div>
            )}
            {selectedItem && selectedItem.itemType == "projectActual" && (
              <div className="text-center">
                <i>Project</i>
                <h4>Actual start date</h4>
                <h4>
                  <b>{selectedItem.start}</b>
                </h4>
                <h4>Actual end date</h4>
                <h4>
                  <b>{selectedItem.end}</b>
                </h4>
              </div>
            )}
            {selectedItem && selectedItem.itemType == "phaseExpected" && (
              <div className="text-center">
                <i>Phase</i>
                <h4>Expected start date</h4>
                <h4>
                  <b>{selectedItem.start}</b>
                </h4>
                <h4>Expected end date</h4>
                <h4>
                  <b>{selectedItem.end}</b>
                </h4>
              </div>
            )}
            {selectedItem && selectedItem.itemType == "phaseActual" && (
              <div className="text-center">
                <i>Phase</i>
                <h4>Actual start date</h4>
                <h4>
                  <b>{selectedItem.start}</b>
                </h4>
                <h4>Actual end date</h4>
                <h4>
                  <b>{selectedItem.end}</b>
                </h4>
              </div>
            )}
            {selectedItem && selectedItem.itemType == "subphase" && (
              <div className="text-center">
                <i>Subphase</i>
                <h3>"{selectedItem.content}"</h3>
                <h4>Start date</h4>
                <h4>
                  <b>{selectedItem.start}</b>
                </h4>
                <h4>End date</h4>
                <h4>
                  <b>{selectedItem.end}</b>
                </h4>
              </div>
            )}
            {selectedItem && selectedItem.itemType == "milestoneOpen" && (
              <div className="text-center">
                <i>Milestone</i>
                <h3>"{selectedItem.content}"</h3>
                <h4>Due date</h4>
                <h4>
                  <b>{selectedItem.start}</b>
                </h4>
              </div>
            )}
            {selectedItem && selectedItem.itemType == "milestoneCompleted" && (
              <div className="text-center">
                <i>Milestone</i>
                <h3>"{selectedItem.content}"</h3>
                <h4>Date completed</h4>
                <h4>
                  <b>{selectedItem.start}</b>
                </h4>
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }
}
