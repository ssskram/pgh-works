
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import Input from '../FormElements/input'
import Select from '../FormElements/select'
import Modal from 'react-responsive-modal'
import * as Assets from '../../store/GETS/taggableAssets'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

const btnStyle = {
    fontSize: '25px',
    border: '1px solid rgb(44, 62, 80)'
}

const types = [
    { value: 'Facility', label: 'Facility', name: 'assetType' },
    { value: 'Project', label: 'Project', name: 'assetType' },
    { value: 'Steps', label: 'Steps', name: 'assetType' },
    { value: 'Retaining Wall', label: 'Retaining Wall', name: 'assetType' },
    { value: 'Pool', label: 'Pool', name: 'assetType' },
    { value: 'Playground', label: 'Playground', name: 'assetType' },
    { value: 'Intersection', label: 'Intersection', name: 'assetType' },
    { value: 'Bridge', label: 'Bridge', name: 'assetType' },
    { value: 'Court', label: 'Court', name: 'assetType' },
    { value: 'Playing Field', label: 'Playing Field', name: 'assetType' },
    { value: 'Park', label: 'Park', name: 'assetType' },
    { value: 'Street', label: 'Street', name: 'assetType' }
]

export class AssetFilter extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            modalIsOpen: false,
            assetName: '',
            assetType: ''
        }
    }

    closeModal() {
        this.setState({
            modalIsOpen: false
        })
    }

    openModal() {
        this.setState({
            modalIsOpen: true
        })
    }

    handleChildChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value });
    }

    filter() {
        this.setState({
            modalIsOpen: false
        })
    }

    public render() {
        const {
            modalIsOpen,
            assetName,
            assetType,
        } = this.state
        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                <button onClick={this.openModal.bind(this)} style={btnStyle} className='btn btn-secondary'><span className='hidden-md hidden-lg hidden-xl glyphicon glyphicon-search'></span><span className='hidden-sm hidden-xs'>Filter</span></button>
                <Modal
                    open={modalIsOpen}
                    onClose={this.closeModal.bind(this)}
                    classNames={{
                        overlay: 'custom-overlay',
                        modal: 'custom-modal'
                    }}
                    center>
                    <div>
                        <div className='col-md-12'>
                            <Input
                                value={assetName}
                                name="assetName"
                                header="Asset name"
                                placeholder="Enter a name"
                                callback={this.handleChildChange.bind(this)}
                            />
                        </div>

                        <div className='col-md-12'>
                            <Select
                                value={assetType}
                                name="assetType"
                                header='Asset type'
                                placeholder='Select type'
                                onChange={this.handleChildSelect.bind(this)}
                                multi={false}
                                options={types}
                            />
                        </div>

                        <div className='col-md-12 text-center'>
                            <button onClick={this.filter.bind(this)} className='btn btn-success'>Apply filter</button>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => ({
        ...state.taggableAssets,
    }),
    ({
        ...Assets.actionCreators,
    })
)(AssetFilter as any) as typeof AssetFilter