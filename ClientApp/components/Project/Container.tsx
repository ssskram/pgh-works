
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/ping'
import * as Projects from '../../store/projects'

export class Project extends React.Component<any, any> {

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    componentWillMount() {
        console.log(this.props)
    }

    componentWillReceiveProps(props) {
        console.log(props)
    }

    public render() {
        return (
            <div>
                <h2>Project</h2>
                <hr/>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.projects
    }),
    ({
        ...Ping.actionCreators,
        ...Projects.actionCreators
    })
  )(Project as any) as typeof Project