import * as React from 'react'
import classNames from 'classnames'
import DatePicker from 'react-datepicker'
import * as moment from 'moment'
import Moment from 'react-moment'

export default class datepicker extends React.Component<any, any> {
    constructor() {
        super()
        this.state = {
            date: null,
            isOpen: false
        }
    }

    componentDidMount() {
        if (this.props.value) {
            this.setState({
                date: moment(this.props.value)
            })
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.value != nextProps.value) {
            this.setState({
                date: moment(nextProps.value)
            })
        }
    }

    toggleCalendar(e) {
        e && e.preventDefault()
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    handleChange(date) {
        this.props.callback(date)
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    public render() {

        var conditionalClass = classNames({
            'form-control': true
        });

        return (
            <div className="form-group">
                <div className="col-md-12 form-element">
                    <h4 className="form-h4">{this.props.header}</h4>
                    <button
                        className="btn btn-datepicker"
                        onClick={this.toggleCalendar.bind(this)}>
                        {this.state.date == null &&
                            <span style={{color: '#aaa'}}>{this.props.placeholder}</span>
                        }
                        {this.state.date != null &&
                            <Moment format="MM/DD/YYYY" date={this.state.date} />
                        }
                    </button>
                    {this.state.isOpen &&
                        <DatePicker
                            selected={this.state.date}
                            name={this.props.name}
                            id={this.props.name}
                            placeholderText={this.props.placeholder}
                            onChange={this.handleChange.bind(this)}
                            className={conditionalClass}
                            calendarClassName="datepicker-calendar"
                            isClearable={true}
                            showMonthDropdown
                            showYearDropdown
                            withPortal
                            inline
                        />
                    }
                </div>
            </div>
        )
    }
}