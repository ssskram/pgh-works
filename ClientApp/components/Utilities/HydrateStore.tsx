
// hydrates the wholeeeeee store

import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Projects from '../../store/projects'
import * as Phases from '../../store/phases'
import * as Milestones from '../../store/milestones'
import * as Attachments from '../../store/attachments'
import * as Tags from '../../store/tags'
import * as TaggableAssets from '../../store/GETS/taggableAssets'
import * as Personnel from '../../store/GETS/personnel'
import * as SubPhases from '../../store/subphases'
import * as Activity from '../../store/activity'

export class Hydrate extends React.Component<any, any> {

    componentDidMount() {
        console.log(this.props)
        const props = this.props

        // load all stores
        props.loadProjects()
        props.loadPhases()
        props.loadMilestones()
        props.loadAttachments()
        props.loadTags()
        props.loadTaggableAssets()
        props.loadPersonnel()
        props.loadSubphases()
        props.loadActivity()
    }

    public render() {
        return null
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.projects,
        ...state.phases,
        ...state.milestones,
        ...state.attachments,
        ...state.tags,
        ...state.taggableAssets,
        ...state.personnel,
        ...state.subphases,
        ...state.activity
    }),
    ({
        ...Projects.actionCreators,
        ...Phases.actionCreators,
        ...Milestones.actionCreators,
        ...Attachments.actionCreators,
        ...Tags.actionCreators,
        ...TaggableAssets.actionCreators,
        ...Personnel.actionCreators,
        ...SubPhases.actionCreators,
        ...Activity.actionCreators
    })
  )(Hydrate as any) as typeof Hydrate