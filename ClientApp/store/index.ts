import * as Ping from './GETS/ping'
import * as User from './GETS/user'
import * as Projects from './projects'
import * as Phases from './phases'
import * as Milestones from './milestones'
import * as Subphases from './subphases'
import * as Attachments from './attachments'
import * as Tags from './tags'
import * as TaggableAssets from './GETS/taggableAssets'
import * as Personnel from './GETS/personnel'
import * as Timeline from './timeline'
import * as Activity from './activity'

export interface ApplicationState {
    user: User.UserState
    ping: Ping.PingState
    projects: Projects.ProjectState
    phases: Phases.PhaseState
    milestones: Milestones.MilestoneState
    subphases: Subphases.SubphaseState
    attachments: Attachments.AttachmentState
    tags: Tags.TagState
    taggableAssets: TaggableAssets.AssetState
    personnel: Personnel.PersonnelState,
    timeline: Timeline.TimelineState,
    activity: Activity.ActivityState
}

export const reducers = {
    user: User.reducer,
    ping: Ping.reducer,
    projects: Projects.reducer,
    phases: Phases.reducer,
    milestones: Milestones.reducer,
    subphases: Subphases.reducer,
    attachments: Attachments.reducer,
    tags: Tags.reducer,
    taggableAssets: TaggableAssets.reducer,
    personnel: Personnel.reducer,
    timeline: Timeline.reducer,
    activity: Activity.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
