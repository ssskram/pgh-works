import * as React from "react";
import Modal from "react-responsive-modal";

export default class Spinner extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      notice: "",
      secondNotice: "",
      thirdNotice: ""
    };
  }

  componentDidMount() {
    if (this.props.secondNotice) {
      this.setState({
        notice: this.props.firstNotice
      });
      setTimeout(this.setSecond.bind(this), 3000);
    } else {
      this.setState({
        notice: this.props.notice
      });
    }
  }

  setSecond() {
    this.setState({
      secondNotice: this.props.secondNotice
    });
    if (this.props.thirdNotice) {
      setTimeout(this.setThird.bind(this), 3000);
    }
  }

  setThird() {
    this.setState({
      thirdNotice: this.props.thirdNotice
    });
  }

  closeModal() {}

  public render() {
    const { notice, secondNotice, thirdNotice } = this.state;

    return (
      <div>
        <Modal
          open={true}
          onClose={this.closeModal.bind(this)}
          classNames={{
            overlay: "spinner-overlay",
            modal: "spinner-modal"
          }}
          animationDuration={1000}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          showCloseIcon={false}
          center
        >
          <div className="loader" />
          {secondNotice == "" && <div>{notice}</div>}
          {secondNotice != "" && thirdNotice == "" && (
            <div>
              {notice}
              <br />
              {secondNotice}
            </div>
          )}
          {secondNotice != "" && thirdNotice != "" && (
            <div>
              {notice}
              <br />
              {secondNotice}
              <br />
              {thirdNotice}
            </div>
          )}
        </Modal>
      </div>
    );
  }
}
