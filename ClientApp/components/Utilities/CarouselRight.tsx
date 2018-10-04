
// the "right" arrow on carousel
// project/phase cards

import * as React from 'react'

const arrowStyle = {
    top: "50%",
    width: "20px",
    height: "20px",
    transform: "translate(0,-50%)",
    cursor: "pointer",
    right: '-25px',
    position: "absolute" as any,
    display: "block"
}

export default class CarouselRight extends React.Component<any, any> {

    public render() {
        return (
            <div style={arrowStyle} onClick={this.props.onClick}><span className='glyphicon glyphicon-chevron-right'></span></div>
        )
    }
}