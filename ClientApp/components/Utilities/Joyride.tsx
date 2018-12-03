
// provides a tour of the site

import * as React from 'react'
import Joyride from 'react-joyride'

export default class SiteTour extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            runTour: false,
            steps: [
                {
                    target: '.my-first-step',
                    content: 'This if my awesome feature!',
                    placement: 'bottom',
                },
                {
                    target: '.my-other-step',
                    content: 'This if my awesome feature!',
                    placement: 'bottom',
                }
            ]
        }
    }

    callback = (data) => {
        // const { action, index, type } = data;
    }

    public render() {
        return <div>
            <button onClick={() => this.setState({ runTour: true })} className='btn btn-success'>
                Take a tour
            </button>
            <Joyride
                steps={this.state.steps}
                run={this.state.run}
                callback={this.callback.bind(this)}
            />
        </div>
    }
}