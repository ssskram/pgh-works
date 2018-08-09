import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as Ping from '../store/ping';
import * as MessagesStore from '../store/messages';
import Messages from './Messages';

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
        return <div className="home-container">
            <div className='text-center'>
                <h1>PGH SPA w/ Redux</h1>
            </div>
            <div className='row'>
                <div className='col-md-4 text-center'>
                </div>
                <div className='col-md-4 text-center'>
                </div>
                <div className='col-md-4 text-center'>
                </div>
            </div>
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