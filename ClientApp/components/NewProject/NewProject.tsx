
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Ping from '../../store/ping'
import { Helmet } from "react-helmet"

export class NewProject extends React.Component<any, any> {

    componentDidMount() {
        // ping server
        this.props.ping()
    }

    public render() {
        return (
            <div>
                <Helmet>
                    <style>{' body { background-color: rgb(44, 62, 80) } '}</style>
                </Helmet>
                <div className='floating-div'>
                    <h2>New project</h2>
                    <hr />
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