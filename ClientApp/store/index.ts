import * as Ping from './GETS/ping'
import * as User from './GETS/user'
import * as Projects from './projects'
import * as Drawdowns from './drawdowns'
import * as Funds from './GETS/funds'
import * as Phases from './phases'
import * as Milestones from './milestones'
import * as Subphases from './subphases'
import * as Attachments from './attachments'
import * as Tags from './tags'
import * as Statuses from './GETS/status'
import * as TaggableAssets from './GETS/taggableAssets'
import * as Personnel from './GETS/personnel'

export interface ApplicationState {
    user: User.UserState
    ping: Ping.PingState
    projects: Projects.ProjectState
    drawdowns: Drawdowns.DrawdownState
    funds: Funds.FundState
    phases: Phases.PhaseState
    milestones: Milestones.MilestoneItem
    subphases: Subphases.SubphaseItem
    attachments: Attachments.AttachmentState
    tags: Tags.TagState
    statuses: Statuses.StatusState,
    taggableAssets: TaggableAssets.AssetState
    personnel: Personnel.PersonnelState
}

export const reducers = {
    user: User.reducer,
    ping: Ping.reducer,
    projects: Projects.reducer,
    drawdowns: Drawdowns.reducer,
    funds: Funds.reducer,
    phases: Phases.reducer,
    milestones: Milestones.reducer,
    subphases: Subphases.reducer,
    attachments: Attachments.reducer,
    tags: Tags.reducer,
    statuses: Statuses.reducer,
    taggableAssets: TaggableAssets.reducer,
    personnel: Personnel.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
