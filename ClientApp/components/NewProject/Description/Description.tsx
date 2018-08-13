
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'
import Map from './../../Map/ProjectMap'

export class ProjectDescription extends React.Component<any, any> {

    public render() {
        return (
            <div>
                <Map shape={this.props.shape}/>
                <h4>Description</h4>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({

    }),
    ({

    })
  )(ProjectDescription as any) as typeof ProjectDescription