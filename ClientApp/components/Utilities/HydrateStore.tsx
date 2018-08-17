
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Projects from '../../store/projects'
import * as Drawdowns from '../../store/drawdowns'
import * as Funds from '../../store/funds'
import * as Phases from '../../store/phases'
import * as Milestones from '../../store/milestones'
import * as Attachments from '../../store/attachments'
import * as Tags from '../../store/tags'
import * as Statuses from '../../store/GETS/status'
import * as TaggableAssets from '../../store/GETS/taggableAssets'
import * as Personnel from '../../store/GETS/personnel'

export class Hydrate extends React.Component<any, any> {

    componentDidMount() {
        console.log(this.props)
        const props = this.props

        // load all stores
        props.loadProjects()
        props.loadDrawdowns()
        props.loadFunds()
        props.loadPhases()
        props.loadMilestones()
        props.loadAttachments()
        props.loadTags()
        props.loadStatuses()
        props.loadTaggableAssets()
        props.loadPersonnel()
    }

    public render() {
        return (
            <div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.projects,
        ...state.drawdowns,
        ...state.funds,
        ...state.phases,
        ...state.milestones,
        ...state.attachments,
        ...state.tags,
        ...state.statuses,
        ...state.taggableAssets,
        ...state.personnel
    }),
    ({
        ...Projects.actionCreators,
        ...Drawdowns.actionCreators,
        ...Funds.actionCreators,
        ...Phases.actionCreators,
        ...Milestones.actionCreators,
        ...Attachments.actionCreators,
        ...Tags.actionCreators,
        ...Statuses.actionCreators,
        ...TaggableAssets.actionCreators,
        ...Personnel.actionCreators
    })
  )(Hydrate as any) as typeof Hydrate