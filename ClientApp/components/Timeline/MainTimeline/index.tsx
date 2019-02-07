
// main timeline module

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import Select from '../../FormElements/select'
import * as Ping from '../../../store/GETS/ping'
import * as TimelineStore from '../../../store/timeline'
import * as Projects from '../../../store/projects'
import * as Phases from '../../../store/phases'
import * as Subphases from '../../../store/subphases'
import * as Milestones from '../../../store/milestones'
import TL from './../Timeline'
import { Helmet } from "react-helmet"
import Spinner from '../../Utilities/Spinner'
import Checkbox from 'rc-checkbox'

export class Timeline extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            expected: true,
            actual: false,
            phase: false,
            subphase: false,
            milestone: false
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0)
        // ping server
        this.props.ping()
    }

    public render() {
        const {
            timeline,
            projects,
            phases,
            subphases,
            milestones
        } = this.props

        const {
            expected,
            actual,
            phase,
            subphase,
            milestone
        } = this.state

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

        if (timeline != '') {
            timeline.split(', ').forEach(projectID => {

                // first, get project
                const project = projects.find(project => projectID == project.projectID)
                // get phases
                const pha = phases.filter(phase => phase.projectID == project.projectID)
                // get subphases
                const subs = subphases.filter(s => s.projectID == project.projectID)
                // get milestones
                const mlston = milestones.filter(mi => mi.projectID == project.projectID)

                // create a timeline grouping per/ project
                let group = {
                    id: project.projectID,
                    content: project.projectName
                }
                groups.push(group)

                if (expected) {
                    // get expected dates, project
                    let expected = {
                        id: index,
                        content: project.expectedStartDate + ' - ' + project.expectedEndDate,
                        start: project.expectedStartDate,
                        end: project.expectedEndDate,
                        group: project.projectID,
                        itemType: 'projectExpected',
                        style: 'background-color: #DAECFB; border-color: #DAECFB;'
                    }
                    index++
                    items.push(expected)
                }
                if (actual) {
                    // get actual dates, project
                    if (project.actualStartDate && project.actualEndDate) {
                        let actual = {
                            id: index,
                            content: project.actualStartDate + ' - ' + project.actualEndDate,
                            start: project.actualStartDate,
                            end: project.actualEndDate,
                            group: project.projectID,
                            itemType: 'projectActual',
                            style: 'background-color: #3473A8; border-color: #3473A8; color: #fffcf5;'
                        }
                        index++
                        items.push(actual)
                    }
                }

                if (phase) {
                    pha.forEach(se => {
                        if (expected) {
                            // get expected dates, phase
                            const expected = {
                                id: index,
                                content: se.phaseName,
                                start: se.expectedStartDate,
                                end: se.expectedEndDate,
                                group: se.projectID,
                                itemType: 'phaseExpected',
                                style: 'background-color: #DAECFB; border-color: #FF986C; border-width: 2px;'
                            }
                            index++
                            items.push(expected)
                        }

                        if (actual) {
                            // get actual dates, phase
                            if (se.actualStartDate && se.actualEndDate) {
                                const actual = {
                                    id: index,
                                    content: se.phaseName,
                                    start: se.actualStartDate,
                                    end: se.actualEndDate,
                                    group: se.projectID,
                                    itemType: 'phaseActual',
                                    style: 'background-color: #3473A8; border-color: #FF986C; border-width: 2px; color: #fffcf5;'
                                }
                                index++
                                items.push(actual)
                            }
                        }
                    })
                }

                if (subphase) {
                    subs.forEach(sub => {
                        const sb = {
                            id: index,
                            content: sub.subphaseName,
                            start: sub.startDate,
                            end: sub.endDate,
                            itemType: 'subphase',
                            group: project.projectID,
                            style: 'background-color: #FFF3E1; border-color: #FFF3E1;'
                        }
                        index++
                        items.push(sb)
                    })
                }

                if (milestone) {
                    mlston.forEach(m => {
                        let o
                        let mi
                        if (m.percentComplete < 100) {
                            if (m.dueDate) {
                                mi = {
                                    id: index,
                                    content: m.milestoneName,
                                    start: m.dueDate,
                                    itemType: 'milestoneOpen',
                                    group: project.projectID,
                                    style: 'max-width: 250px; background-color: #ECE0FB; border-color: #ECE0FB;'
                                }
                                index++
                            }
                        } else {
                            mi = {
                                id: index,
                                content: m.milestoneName,
                                start: m.dateCompleted,
                                itemType: 'milestoneCompleted',
                                group: project.projectID,
                                style: 'max-width: 250px; background-color: #ECE0FB; border-color: #ECE0FB;'
                            }
                            index++
                        }
                        if (mi) items.push(mi)
                    })
                }
            })
        }

        return (
            <div>
                <Helmet>
                    <style>{'.Select-menu-outer { z-index: 999 !important; }'}</style>
                </Helmet>
                <h2>Timeline</h2>
                <hr />
                <Select
                    value={this.props.timeline}
                    header='Add projects to the timeline'
                    placeholder='Select projects...'
                    onChange={tl => this.props.setTimeline(tl)}
                    multi={true}
                    options={projectDropdown}
                />
                {timeline != '' &&
                    <div>
                        <div className='col-md-12' style={{ marginBottom: '15px', fontSize: '14px' }}>
                            <span style={{ border: '2px solid #DAECFB', backgroundColor: '#DAECFB', padding: '8px', borderRadius: '0px 5px 5px 0px' }}>Expected <Checkbox checked={expected} onChange={() => this.setState({ expected: !expected })} /></span>
                            <span style={{ border: '2px solid #3473A8', backgroundColor: '#3473A8', color: '#fffcf5', padding: '8px' }}>Actual <Checkbox checked={actual} onChange={() => this.setState({ actual: !actual })} /></span>
                            <span style={{ border: '2px solid #FF986C', padding: '8px' }}>Phase <Checkbox checked={phase} onChange={() => this.setState({ phase: !phase })} /></span>
                            <span style={{ border: '2px solid #FFF3E1', backgroundColor: '#FFF3E1', padding: '8px' }}>Subphase <Checkbox checked={subphase} onChange={() => this.setState({ subphase: !subphase })} /></span>
                            <span style={{ border: '2px solid #ECE0FB', backgroundColor: '#ECE0FB', padding: '8px', borderRadius: '0px 5px 5px 0px' }}>Milestone <Checkbox checked={milestone} onChange={() => this.setState({ milestone: !milestone })} /></span>
                        </div>
                        <TL groups={groups} items={items} />
                        <br />
                    </div>
                }
                {timeline == '' &&
                    <div className='col-md-12 text-center'>
                        <br />
                        <div className='text-center alert alert-info'>
                            <h3 style={{ letterSpacing: '2px' }}>The timeline is empty</h3>
                        </div>
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
        ...state.subphases,
        ...state.milestones
    }),
    ({
        ...Ping.actionCreators,
        ...TimelineStore.actionCreators,
        ...Projects.actionCreators,
        ...Phases.actionCreators,
        ...Subphases.actionCreators,
        ...Milestones.actionCreators
    })
)(Timeline as any) as typeof Timeline