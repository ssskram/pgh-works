
// user draws a new polygon here

import * as React from "react"
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete'

export default class PolygonGeneration extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            address: '',
            latLng: {}
        }
    }

    handleChange = address => {
        this.setState({ address })
        if (address == '') {
            this.props.selectAddress('', {})
        }
    }

    async handleSelect(address) {
        this.setState({ address })
        await geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.props.selectAddress(latLng))
            .catch(error => console.error(error))
    }

    render() {
        const {
            address
        } = this.state

        return (
            <div>
                <div className='col-md-12'>
                    <PlacesAutocomplete
                        value={address}
                        onChange={this.handleChange.bind(this)}
                        onSelect={this.handleSelect.bind(this)}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                                <input style={{ margin: '0 auto', width: '80%' }}
                                    {...getInputProps({
                                        placeholder: 'Search for an address...',
                                        className: 'form-control'
                                    })}
                                    type='search' />
                                {suggestions.length > 0 &&
                                    <div className="autocomplete-dropdown-container">
                                        {suggestions.map(suggestion => {
                                            const className = suggestion.active
                                                ? 'suggestion-item--active'
                                                : 'suggestion-item';
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                            return (
                                                <div
                                                    {...getSuggestionItemProps(suggestion, {
                                                        className,
                                                        style,
                                                    })}
                                                >
                                                    <span>{suggestion.description}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                }
                                <br />
                            </div>
                        )}
                    </PlacesAutocomplete>
                </div>
            </div>
        )
    }
}