
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Hydrate from './../Utilities/HydrateStore'
import * as Ping from '../../store/GETS/ping'
import * as Activity from '../../store/activity'
import * as Projects from '../../store/projects'
import Paging from '../Utilities/Paging'
import { returnPageNumber, returnCurrentItems } from './../../functions/paging'
import ActivityFilter from './../Filters/ActivityFilter'
import Spinner from '../Utilities/Spinner'
import hashtagIt from '../../functions/hashtagIt'
import { SpeechBubble } from 'react-kawaii'
import { subscribeToActivity } from '../../sockets/activity'

const padding = {
    padding: '10px 0px'
}

const emptyNotice = {
    letterSpacing: '2px'
}

export class AllActivity extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            activity: [],
            currentPage: 1,
            redirectLink: '',
            redirect: false,
            onFilter: false
        }
        subscribeToActivity((err, activity) => this.props.receiveActivity(activity))
    }

    componentDidMount() {
        window.scrollTo(0, 0)

        // ping server
        this.props.ping()

        this.setActivity(this.props.activity)
    }

    componentWillReceiveProps(nextProps) {
        if (this.props != nextProps && this.state.onFilter == false) {
            this.setActivity(nextProps.activity)
        }
    }

    setActivity(activity) {
        this.setState({
            activity: activity.sort((a, b) => +new Date(b.date) - +new Date(a.date))
        })
    }

    handleNextClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current + 1
        });
    }

    handlePreviousClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current - 1
        });
    }

    receiveFilteredActivity(activity) {
        this.setState({
            onFilter: true
        }, function (this) {
            this.setActivity(activity)
        })
    }

    getParentLink(props) {
        this.setState({
            redirectLink: "/Project/id=" + props.parentID,
            redirect: true
        })
    }

    getParentName(activity) {
        // hashtag it!
        const parent = this.props.projects.find(project => project.projectID == activity.parentID)
        return hashtagIt(parent.projectName)
    }

    public render() {
        const {
            activity,
            onFilter,
            redirectLink,
            redirect,
            currentPage
        } = this.state

        if (redirect) {
            return <Redirect push to={redirectLink} />
        }

        const currentItems = returnCurrentItems(activity, currentPage)
        const pageNumbers = returnPageNumber(activity)
        const renderItems = currentItems.map((activity, index) => {
            return <div className='col-md-12' key={index}>
                <div className='panel panel-button'>
                    <div onClick={() => this.getParentLink(activity)} style={padding} className='panel-body text-center'>
                        <div className='col-md-4'>
                            <h4>{activity.user}</h4>
                            <h5>{activity.date}</h5>
                        </div>
                        <div className='col-md-8 enlargeOnHover'>
                            <h4 className='panel-blue-font'>"{activity.activity}"</h4>
                            <h5 className='ellipsis' style={padding}><b>#{this.getParentName(activity)}</b></h5>
                        </div>
                    </div>
                </div>
            </div>
        })

        return (
            <div>
                <Hydrate />
                {activity.length == 0 && onFilter == false &&
                    <Spinner notice='...loading activity...' />
                }
                <div className='row'>
                    <span className='pull-left'>
                        <SpeechBubble size={60} mood="happy" color="#7EB1DC" />
                    </span>
                    <span className='pull-right'>
                        <ActivityFilter
                            returnFiltered={this.receiveFilteredActivity.bind(this)} />
                    </span>
                </div>

                <br />
                {activity.length > 0 &&
                    <div className='row'>
                        {renderItems}
                        <br />
                        <br />
                        <Paging
                            count={activity}
                            currentPage={currentPage}
                            totalPages={pageNumbers}
                            next={this.handleNextClick.bind(this)}
                            prev={this.handlePreviousClick.bind(this)} />
                        <br />
                        <br />
                    </div>
                }
                {activity.length == 0 && onFilter == true &&
                    <div className='col-md-12' style={{ margin: '20px 0px' }}>
                        <div className='text-center alert alert-info'>
                            <h2 style={emptyNotice}>No activity matching those criteria</h2>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.activity,
        ...state.projects
    }),
    ({
        ...Ping.actionCreators,
        ...Activity.actionCreators,
        ...Projects.actionCreators
    })
)(AllActivity as any) as typeof AllActivity