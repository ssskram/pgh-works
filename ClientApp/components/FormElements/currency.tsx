import * as React from 'react';
import CurrencyInput from 'react-currency-input';

export default class currency extends React.Component<any, any> {

    public render() {
        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4 className="form-h4">{this.props.header}</h4>
                    <CurrencyInput className="form-control" prefix="$" precision="0" value={this.props.value} onChangeEvent={this.props.callback.bind(this)}/>
                </div>
            </div>
        )
    }
}
