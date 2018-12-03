
// provides a tour of the site

import * as React from 'react'
import Joyride from 'react-joyride'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Textarea from '../FormElements/textarea'

const btnStyle = {
    fontSize: '16px',
    letterSpacing: '2px'
}

const styleLarge = {
    position: 'absolute' as any,
    top: '0px',
    right: '0px',
    padding: '0px 15px 0px 45px',
    backgroundColor: '#5cb85c',
    color: '#fff',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.4)',
    width: '100%',
    textAlign: 'right'
}

const styleSmall = {
    position: 'absolute' as any,
    top: '76px',
    right: '0px',
    padding: '5px',
    backgroundColor: '#5cb85c',
    width: '100%',
    color: '#fff'
}

export default class SiteTour extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            index: 0,
            buttonHover: false,
            feedback: '',
            runTour: false,
            showForm: false,
            steps: [
                {
                    target: '.mainApp',
                    content: 'This is PGH Works',
                    placement: 'center',
                    disableBeacon: true
                },
                {
                    target: '.myProjects',
                    content: 'Hey these are yours!',
                    placement: 'right',
                    disableBeacon: true
                },
                {
                    target: '.allActivity',
                    content: 'Like tweets, ya know?!',
                    placement: 'right',
                    disableBeacon: true
                },
                {
                    target: '.allProjects',
                    content: 'All the projects',
                    placement: 'right',
                    disableBeacon: true
                },
                {
                    target: '.allAssets',
                    content: 'All of the assets',
                    placement: 'right',
                    disableBeacon: true
                },
                {
                    target: '.timeline',
                    content: 'See them shits in spacetime',
                    placement: 'right',
                    disableBeacon: true
                },
                {
                    target: '.addProject',
                    content: 'Add one!',
                    placement: 'right',
                    disableBeacon: true
                }
            ]
        }
    }

    callback = (data) => {
        if (data.action == 'close' || data.status == 'finished') {
            this.setState({
                runTour: false,
                index: 0
            })
        } else if (data.action == 'next' && data.lifecycle == 'complete') {
            this.setState({
                index: data.index + 1
            })
        } else if (data.action == 'prev' && data.lifecycle == 'complete') {
            this.setState({
                index: data.index - 1
            })
        }
    }

    public render() {
        const {
            runTour,
            showForm,
            steps,
            feedback,
            index
        } = this.state

        const isEnabled = feedback != ''

        const header =
            <div>
                <div className='btn' style={btnStyle} onClick={() => this.setState({ runTour: !runTour })}>
                    {runTour ? "End tour" : "Take a tour"}
                </div>
                or
                <div className='btn' style={btnStyle} onClick={() => this.setState({ showForm: !showForm })}>
                    {showForm ? "Close feedback" : "Submit feedback"}
                </div>
            </div>

        const form =
            <ReactCSSTransitionGroup
                transitionName="example"
                transitionAppear={true}
                transitionAppearTimeout={500}
                transitionEnter={false}
                transitionLeave={false}>
                <Textarea
                    value={feedback}
                    placeholder="Issues? Requests? Musings?  Don't be shy "
                    callback={e => this.setState({ feedback: e.target.value })}
                />
                <button disabled={!isEnabled} className='btn btn-success'>Submit</button>
            </ReactCSSTransitionGroup>

        return <div>
            <div className='hidden-xl hidden-lg hidden-md hidden-sm text-center' style={styleSmall}>
                <div>{header}</div>
                {this.state.showForm == true &&
                    form
                }
            </div>
            <div className='hidden-xs' style={styleLarge}>
                <div>{header}</div>
                <div className='pull-right text-center' style={{width: '400px'}}>
                    {this.state.showForm == true &&
                        form
                    }
                </div>
            </div>
            <Joyride
                steps={steps}
                stepIndex={index}
                run={runTour}
                continuous={true}
                showProgress={true}
                callback={this.callback.bind(this)}
            />
        </div>
    }
}