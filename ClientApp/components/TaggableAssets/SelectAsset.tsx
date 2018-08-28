
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import Input from '../FormElements/input'
import Paging from '../Utilities/Paging'

export class SelectAsset extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1,
            itemsPerPage: 25,
            search: '',
            assets: props.assets.filter(asset => asset.assetType == props.assetType)
        }
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value });
        this.filter(event.target.value)
    }

    filter(value) {
        var filteredAssets = this.state.assets.filter(asset => asset.assetName.toLowerCase().includes(value.toLowerCase()))
        if (value != '') {
            this.setState({
                assets: filteredAssets
            })
        } else {
            this.setState({
                assets: this.props.assets.filter(asset => asset.assetType == this.props.assetType)
            })
        }
    }

    handleNextClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current + 1
        });
    }

    handlePreviousClick() {
        window.scrollTo(0, 0)
        let current = this.state.currentPage
        this.setState({
            currentPage: current - 1
        });
    }

    public render() {
        const {
            assetType
        } = this.props

        const {
            currentPage,
            itemsPerPage,
            assets,
            search
        } = this.state

        var searchPlaceholder = "Search for " + assetType

        // Logic for paging
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem);
        const renderItems = currentItems.map((item) => {
            return (
                <div className="col-md-12" key={item.assetOID}>
                    <button className='btn btn-success' onClick={() => this.props.receiveAsset(item)}>{item.assetName}</button>
                </div>
            )
        })

        // Logic for displaying page numbers
        const pageNumbers: any[] = []
        for (let i = 1; i <= Math.ceil(assets.length / itemsPerPage); i++) {
            pageNumbers.push(i);
        }

        return (
            <div>
                <div className='col-md-12'>
                    <br />
                    <h3 className='pull-left'>Select {assetType}</h3>
                    <button onClick={this.props.back} className='btn btn-warning pull-right'>Back</button>
                </div>
                <div className='col-md-12'>
                    <hr />
                </div>
                <div className='col-md-12'>
                    <Input
                        value={search}
                        name="search"
                        header=""
                        placeholder={searchPlaceholder}
                        callback={this.handleChildChange.bind(this)}
                    />
                </div>
                <div className='col-md-12 text-center'>
                    {renderItems}
                </div>
                <div className='col-md-12'>
                    <br/>
                    <Paging
                        count={assets}
                        currentPage={currentPage}
                        totalPages={pageNumbers}
                        next={this.handleNextClick.bind(this)}
                        prev={this.handlePreviousClick.bind(this)} />
                    <br />
                </div>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.taggableAssets
    }),
    ({
        ...Assets.actionCreators
    })
)(SelectAsset as any) as typeof SelectAsset