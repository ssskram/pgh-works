import * as Messages from './messages'
import * as Ping from './ping'
import * as User from './user'
import * as Projects from './projects'
import * as Drawdowns from './drawdowns'
import * as Funds from './funds'
import * as Phases from './phases'
import * as Milestones from './milestones'

export interface ApplicationState {
    user: User.UserState
    ping: Ping.PingState
    messages: Messages.MessageState
    projects: Projects.ProjectState
    drawdowns: Drawdowns.DrawdownState
    funds: Funds.FundState
    phases: Phases.PhaseState
    milestones: Milestones.MilestoneItem
}
export const reducers = {
    user: User.reducer,
    ping: Ping.reducer,
    messages: Messages.reducer,
    projects: Projects.reducer,
    drawdowns: Drawdowns.reducer,
    funds: Funds.reducer,
    phases: Phases.reducer,
    milestones: Milestones.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
