
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'

export class Tags extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <h3>You have not added any tags to this project</h3>
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
  )(Tags as any) as typeof Tags