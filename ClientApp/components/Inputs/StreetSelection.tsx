
import * as React from 'react'
import { connect } from 'react-redux'
import { ApplicationState } from '../../store'
import * as Assets from '../../store/GETS/taggableAssets'
import Select from '../FormElements/select'
import { Helmet } from "react-helmet"

let streets = [] as any

const dropdownStyle = '.custom-modal { overflow: visible; } .Select-menu-outer { overflow: visible}'

export class StreetSelection extends React.Component<any, any> {
    constructor(props) {
        super(props)
        this.state = {
            street: ''
        }
    }

    componentDidMount() {
        const streetsObjects = this.props.assets.filter(function (asset) {
            return asset.assetType == 'Street'
        })
        const streetNames = streetsObjects.map(function (street) {
            return street.assetName
        })
        const uniqueNames = streetNames.filter((v, i, a) => a.indexOf(v) === i);
        this.setStreetsDropdown(uniqueNames)
    }

    componentWillReceiveProps(nextProps) {
        const streetsObjects = nextProps.assets.filter(function (asset) {
            return asset.assetType == 'Street'
        })
        const streetNames = streetsObjects.map(function (street) {
            return street.assetName
        })
        const uniqueNames = streetNames.filter((v, i, a) => a.indexOf(v) === i);
        this.setStreetsDropdown(uniqueNames)
    }

    onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    setStreetsDropdown(props) {
        streets = []
        props.forEach(function (street) {
            if (street != '') {
                let json = { "value": street, "label": street, "name": 'street' }
                streets.push(json)
            }
        })
    }

    handleChildSelect(event) {
        this.setState({ [event.name]: event.value })
        this.props.returnStreet(event)
    }

    public render() {
        const {
            street
        } = this.state

        return (
            <div className='col-md-12'>
                <Helmet>
                    <style>{dropdownStyle}</style>
                </Helmet>
                <Select
                    value={street}
                    name="street"
                    header='Select street'
                    placeholder='Search by name'
                    onChange={this.handleChildSelect.bind(this)}
                    multi={false}
                    options={streets}
                />
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
)(StreetSelection as any) as typeof StreetSelection