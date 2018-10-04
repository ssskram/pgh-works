import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Login extends React.Component<RouteComponentProps<{}>, {}> {
    // calls up server endpoint, renders login page
    componentWillMount() {
        window.location.reload();
    }
}