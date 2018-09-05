
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'

export class PhaseFollows extends React.Component<any, any> {

    componentDidMount() {
    }

    public render() {
        return (
            <div>
                <h3>Phase follows here</h3>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
    }),
    ({
    })
  )(PhaseFollows as any) as typeof PhaseFollows