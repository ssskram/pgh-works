
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../../store'

export class ImportShape extends React.Component<any, any> {

    componentDidMount() {
        // load assets
    }

    public render() {
        return (
            <div>
                <h2>Search and select asset</h2>
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
  )(ImportShape as any) as typeof ImportShape