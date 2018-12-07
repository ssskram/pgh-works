
import * as React from 'react'
import Select from '../FormElements/select'
import { Helmet } from "react-helmet"

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

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

export default class SelectAssetType extends React.Component<any, any> {
    public render() {
        const {
            assetType,
            receiveType
        } = this.props

        return (
            <div>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                <div className='col-md-12'>
                    <Select
                        value={assetType}
                        header='Select an asset type'
                        placeholder='Select type'
                        onChange={e => receiveType(e.value)}
                        multi={false}
                        options={types}
                    />
                </div>
            </div>
        )
    }
}