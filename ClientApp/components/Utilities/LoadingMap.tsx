import * as React from 'react';

export default class LoadingMap extends React.Component<any, any> {

    public render() {
        const {
            notice
        } = this.props

        return <div>
            <h1 style={{padding: '100px 0px'}}>{notice}</h1>
        </div>
    }
}