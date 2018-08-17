import * as React from 'react';
import CurrencyInput from 'react-currency-input';
import classNames from 'classnames'

export default class currency extends React.Component<any, any> {

    public render() {

        var conditionalClass = classNames({
            'form-control': true,
            'highlight-filter': this.props.value
        });

        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4 className="form-h4">{this.props.header}</h4>
                    <CurrencyInput type='search'
                        className={conditionalClass}
                        prefix="$"
                        precision="0"
                        value={this.props.value}
                        onChangeEvent={this.props.callback.bind(this)} />
                </div>
            </div>
        )
    }
}
