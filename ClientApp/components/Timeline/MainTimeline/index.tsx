
// main timeline module

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import { Link } from 'react-router-dom'
import Select from '../../FormElements/select'
import * as Ping from '../../../store/GETS/ping'
import * as TimelineStore from '../../../store/timeline'
import * as Projects from '../../../store/projects'
import * as Phases from '../../../store/phases'
import * as Activity from '../../../store/activity'
import * as Subphases from '../../../store/subphases'
import * as Milestones from '../../../store/milestones'
import TL from './../Timeline'
import { Helmet } from "react-helmet"
import Spinner from '../../Utilities/Spinner'

export class Timeline extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)
        // ping server
        this.props.ping()
    }

    updateTimeline(projects) {
        this.props.setTimeline(projects)
    }

    public render() {
        const {
            timeline,
            projects,
            phases,
            activity,
            subphases,
            milestones
        } = this.props

        let projectDropdown = [] as any
        if (projects.length > 0) {
            projects.forEach(project => {
                const projectSelect = { value: project.projectID, label: project.projectName }
                projectDropdown.push(projectSelect)
            })
        }

        let groups = [] as any
        let items = [] as any
        let index = 1

        console.log(timeline)
        
        // timeline.forEach(function (item) {
        //     console.log(item)
        //     // first, get project
        //     const project = projects.find(project => item.project == project.projectID)
        //     let group = {
        //         id: project.projectID,
        //         content: project.projectName
        //     }
        //     groups.push(group)

        //     let expected = {
        //         id: index,
        //         content: project.expectedStartDate + ' - ' + project.expectedEndDate,
        //         start: project.expectedStartDate,
        //         end: project.expectedEndDate,
        //         group: project.projectID,
        //         itemType: 'projectExpected',
        //         style: 'background-color: #ACD1EF; border-color: #ACD1EF;'
        //     }
        //     index = index + 1
        //     items.push(expected)
        //     if (item.actualStartDate && item.actualEndDate) {
        //         let actual = {
        //             id: index,
        //             content: project.actualStartDate + ' - ' + project.actualEndDate,
        //             start: project.actualStartDate,
        //             end: project.actualEndDate,
        //             group: project.id,
        //             itemType: 'projectActual',
        //             style: 'background-color: #1561A1; border-color: #1561A1; color: #fffcf5;'
        //         }
        //         index = index + 1
        //         items.push(actual)
        //     }
        // })

        return (
            <div>
                {/* <Helmet>
                    <style>{'body { background-color: #383838; .vis-timeline { height: 100vh; } } '}</style>
                </Helmet> */}
                <h2>Timeline</h2>
                <hr />
                {timeline != '' &&
                    <div>
                        <Select
                            value={this.props.timeline}
                            header='Add projects to the timeline'
                            placeholder='Select projects...'
                            onChange={tl => this.props.setTimeline(tl)}
                            multi={true}
                            options={projectDropdown}
                        />
                        <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                            <span style={{ border: '2px solid #ACD1EF', backgroundColor: '#ACD1EF', padding: '8px' }}>Expected</span>
                            <span style={{ border: '2px solid #1561A1', backgroundColor: '#1561A1', color: '#fffcf5', padding: '8px' }}>Actual</span>
                            <span style={{ backgroundColor: '#FFD143', padding: '8px', borderRadius: '0px 5px 5px 0px' }}>Activity</span>
                            <span style={{ border: '2px solid #FF986C', padding: '8px' }}>Phase</span>
                            <span style={{ backgroundColor: '#FFB043', padding: '8px' }}>Subphase</span>
                            <span style={{ backgroundColor: '#FF7B43', padding: '8px', borderRadius: '0px 5px 5px 0px' }}>Milestone</span>
                        </div>
                        <TL groups={groups} items={items} />
                        <br />
                    </div>
                }
                {timeline == '' &&
                    <div className='col-md-12'>
                        <h1 className='text-center'>The timeline is empty</h1>
                        <Select
                            value={this.props.timeline}
                            header='Add projects to the timeline'
                            placeholder='Select projects...'
                            onChange={tl => this.props.setTimeline(tl)}
                            multi={true}
                            options={projectDropdown}
                        />
                    </div>
                }
                {projects.length == 0 &&
                    <Spinner notice='...loading the timeline...' />
                }
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.ping,
        ...state.timeline,
        ...state.projects,
        ...state.phases,
        ...state.activity,
        ...state.subphases,
        ...state.milestones
    }),
    ({
        ...Ping.actionCreators,
        ...TimelineStore.actionCreators,
        ...Projects.actionCreators,
        ...Phases.actionCreators,
        ...Activity.actionCreators,
        ...Subphases.actionCreators,
        ...Milestones.actionCreators
    })
)(Timeline as any) as typeof Timeline