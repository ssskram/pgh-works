
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
                <h3>Import shape</h3>
                <hr/>
                <div className='row col-md-12'>
                   <i>Interface for searching & selecting shape-bound asset from Cartegraph</i>
                </div>
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