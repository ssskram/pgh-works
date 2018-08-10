import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Ping from '../store/ping';
import * as MessagesStore from '../store/messages';
import Map from './Map/Map'
import { Helmet } from "react-helmet"

export class Home extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()
    }

    componentWillUnmount() {
        this.props.clear()
    }

    public render() {
        return <div>
            <Helmet>
                <style>{'.col-sm-9 { width: 100%; padding: 0; } .container-fluid { padding: 0; } body { padding: 0 } '}</style>
            </Helmet>
            <Map />
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.messages,
        ...state.ping
    }),
    ({
        ...MessagesStore.actionCreators,
        ...Ping.actionCreators
    })
)(Home as any) as typeof Home;