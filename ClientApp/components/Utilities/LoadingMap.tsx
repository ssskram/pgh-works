import * as React from 'react';

export default class LoadingMap extends React.Component<any, any> {

    public render() {
        const {
            notice
        } = this.props

        return <div>
            <img src='./images/mapSpinnerDark.png'></img>
            <h2>{notice}</h2>
        </div>;
    }
}