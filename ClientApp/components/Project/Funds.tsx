
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'

export class Funds extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <h3>You have not added any funds to this project</h3>
                <hr/>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
    }),
    ({
    })
  )(Funds as any) as typeof Funds