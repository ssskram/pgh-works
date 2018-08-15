import * as React from 'react'
import Hydrate from './Utilities/HydrateStore'
import { connect } from 'react-redux'
import { ApplicationState } from '../store'
import * as Ping from '../store/GETS/ping'
import Map from './Map/HomeMap'
import { Helmet } from "react-helmet"

export class Home extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()
    }


    public render() {
        return <div>
            <Hydrate />
            <Helmet>
                <style>{'.col-sm-9 { width: 100%; padding: 0; } .container-fluid { padding: 0; } body { padding: 0 } '}</style>
            </Helmet>
            <Map />
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping
    }),
    ({
        ...Ping.actionCreators
    })
)(Home as any) as typeof Home;