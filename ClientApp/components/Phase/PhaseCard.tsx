
import * as React from 'react'
import Slider from "react-slick";
import RightArrow from './../Utilities/CarouselRight'
import LeftArrow from './../Utilities/CarouselLeft'

const bigFont = {
    fontSize: '18px'
}

const borderNone = {
    border: 'none'
}

const phaseContainer = {
    backgroundColor: '#f3fafe',
    borderRadius: '10px',
    padding: '10px',
    margin: '5px 0px',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.1)'
}

const metaContainer = {
    margin: '5px 0px',
    padding: '0px 0px 0px 30px'
}

export default class PhaseCard extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    public render() {
        const {
            phaseDescription,
            phaseStatus,
            notes,
            created
        } = this.props.phase

        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true,
            nextArrow: <RightArrow />,
            prevArrow: <LeftArrow />
        };

        return (
            <div>
                <div className='row'>
                    <br />
                    <Slider {...settings}>
                        <div className='col-md-12 text-center'>
                            <h3><u>Phase status</u></h3>
                            <h2>{phaseStatus}</h2>
                        </div>
                        {phaseDescription &&
                            <div className='col-md-12 text-center'>
                                <h3><u>Description</u></h3>
                                <h2>{phaseDescription}</h2>
                            </div>
                        }
                        <div className='col-md-12 text-center'>
                            <h3><u>Phase created</u></h3>
                            <h2>{created}</h2>
                        </div>
                        {notes &&
                            <div className='col-md-12 text-center'>
                                <h3><u>Notes</u></h3>
                                <h2>{notes}</h2>
                            </div>
                        }
                    </Slider>
                </div>
                <br />
                <br />
                <br />
            </div>
        )
    }
}
