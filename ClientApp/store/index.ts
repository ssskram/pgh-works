import * as Messages from './messages'
import * as Ping from './ping'
import * as User from './user'
import * as Projects from './projects'

export interface ApplicationState {
    user: User.UserState
    ping: Ping.PingState
    messages: Messages.MessageState
    projects: Projects.ProjectState
}
export const reducers = {
    user: User.reducer,
    ping: Ping.reducer,
    messages: Messages.reducer,
    projects: Projects.reducer
};

export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
