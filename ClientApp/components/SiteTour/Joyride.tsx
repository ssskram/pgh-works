
// provides a tour of the site

import * as React from 'react'
import Joyride from 'react-joyride'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

const styleLarge = {
    position: 'absolute' as any,
    top: '0px',
    right: '0px',
    padding: '8px 15px 8px 45px',
    backgroundColor: '#5cb85c',
    borderRadius: '0px 0px 0px 15px',
    color: '#fff'
}

const styleSmall = {
    position: 'absolute' as any,
    top: '51px',
    right: '0px',
    padding: '5px',
    backgroundColor: '#5cb85c',
    width: '100%'
}

export default class SiteTour extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            runTour: false,
            showForm: false,
            steps: [
                {
                    target: '.myProjects',
                    content: 'Hey these are yours!',
                    placement: 'right',
                },
                {
                    target: '.allActivity',
                    content: 'Like tweets, ya know?!',
                    placement: 'right',
                },
                {
                    target: '.projectFilter',
                    content: 'Filters are your friend',
                    placement: 'right',
                }
            ]
        }
    }

    callback = (data) => {
        const { action, index, type } = data
    }

    public render() {

        const header =
            <button onClick={() => this.setState({ runTour: true })} className='btn btn-success'>
                Take a tour
            </button>

        const form =
            <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}>
                <h4 style={{ color: '#fff' }}>Contact Evolve 365 Live Support</h4>
                <h4 style={{ color: '#fff' }} className='hidden-sm hidden-md hidden-lg hidden-xl'><b><a href="tel:+1-844-279-8423">1-844-279-8423</a></b></h4>
                <h4 style={{ color: '#fff' }} className='hidden-xs'><b>1-844-279-8423</b></h4>
            </ReactCSSTransitionGroup>

        return <div>
            <div className='hidden-xl hidden-lg hidden-md hidden-sm text-center' style={styleSmall}>
                <div>{header}</div>
                {this.state.showForm == true &&
                    form
                }
            </div>
            <div className='hidden-xs text-center' style={styleLarge}>
                <div>{header}</div>
                {this.state.showForm == true &&
                    form
                }
            </div>
            <Joyride
                steps={this.state.steps}
                run={this.state.runTour}
                continuous={true}
                showProgress={true}
                callback={this.callback.bind(this)}
            />
        </div>
    }
}