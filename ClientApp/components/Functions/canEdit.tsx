import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as User from '../../store/GETS/user'

export function canEdit() {
    
}

export default connect(
    (state: ApplicationState) => ({
        ...state.user
    }),
    ({
        ...User.actionCreators
    })
)

