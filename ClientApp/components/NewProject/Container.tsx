
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/ping'
import Geolocate from './Geolocate/Geolocate'

export class NewProject extends React.Component<any, any> {
    constructor() {
        super();
        this.state = {
            step: 1,
            shape: []
        }
    }

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    setShape(shape) {
        this.setState({
            shape: shape
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

    public render() {
        const {
            step,
            shape
        } = this.state

        return (
            <div>
                <div>
                    <h2>New project</h2>
                    <hr />
                    {step == 1 &&
                        <Geolocate
                            next={this.next.bind(this)}
                            setShape={this.setShape.bind(this)}
                        />
                    }
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping
    }),
    ({
        ...Ping.actionCreators
    })
)(NewProject as any) as typeof NewProject