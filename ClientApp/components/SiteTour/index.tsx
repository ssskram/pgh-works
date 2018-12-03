
// provides a tour of the site

import * as React from 'react'
import Joyride from 'react-joyride'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import Textarea from '../FormElements/textarea'
import MainApp from './contents/mainApp'
import MyProjects from './contents/myProjects'
import AllActivity from './contents/allActivity'
import AllProjects from './contents/allProjects'
import AllAssets from './contents/allAssets'
import Timeline from './contents/timeline'
import AddProject from './contents/addProject'

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
            showForm: false
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

        const steps = [
            {
                target: '.mainApp',
                content: <MainApp />,
                placement: 'center',
                disableBeacon: true
            },
            {
                target: '.myProjects',
                content: <MyProjects />,
                placement: 'right',
                disableBeacon: true
            },
            {
                target: '.allActivity',
                content: <AllActivity />,
                placement: 'right',
                disableBeacon: true
            },
            {
                target: '.allProjects',
                content: <AllProjects />,
                placement: 'right',
                disableBeacon: true
            },
            {
                target: '.allAssets',
                content: <AllAssets />,
                placement: 'right',
                disableBeacon: true
            },
            {
                target: '.timeline',
                content: <Timeline />,
                placement: 'right',
                disableBeacon: true
            },
            {
                target: '.addProject',
                content: <AddProject />,
                placement: 'right',
                disableBeacon: true
            }
        ]

        return <div>
            <div className='hidden-xl hidden-lg hidden-md hidden-sm text-center' style={styleSmall}>
                <div>{header}</div>
                {this.state.showForm == true &&
                    form
                }
            </div>
            <div className='hidden-xs' style={styleLarge}>
                <div>{header}</div>
                <div className='col-sm-9 col-md-offset-3 text-center'>
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
                styles={{
                    options: {
                        backgroundColor: '#FAF7F2',
                        primaryColor: '#337ab7'
                    }
                }}
            />
        </div>
    }
}