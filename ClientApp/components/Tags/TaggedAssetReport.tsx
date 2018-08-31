
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Tag from '../../store/GETS/ping'

export class TaggedAssetReport extends React.Component<any, any> {

    componentDidMount() {
        console.log(this.props)
    }

    public render() {
        const {
            tag,
            tags
        } = this.props

        const relevantTags = tags.filter(function (item) {
            return item.taggedAssetOID == tag.taggedAssetOID
        })

        return (
            <div>
                <h3><b>{tag.taggedAssetName}</b></h3>
                <h4><i>Tags</i></h4>
                <hr />
                {relevantTags.map((tag) => {
                    const link = '/' + tag.parentType + '/id=' + tag.parentID
                    return (
                        <div className='panel' key={tag.tagID}>
                            <div className='panel-body text-center'>
                                <div className='col-md-9'>
                                    <div className='row'>
                                        <h3>{tag.parentName}</h3>
                                    </div>
                                    <div className='row'>
                                        <h4><i>{tag.parentType}</i></h4>
                                    </div>
                                </div>
                                <div className='col-md-3'>
                                    <button className='btn btn-success'><span className='glyphicon glyphicon-search'></span></button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.tags
    }),
    ({
        ...Tag.actionCreators
    })
)(TaggedAssetReport as any) as typeof TaggedAssetReport