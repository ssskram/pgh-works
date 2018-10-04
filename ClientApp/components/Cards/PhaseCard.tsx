
// carousel on phase page

import * as React from 'react'
import Slider from "react-slick";
import RightArrow from '../Utilities/CarouselRight'
import LeftArrow from '../Utilities/CarouselLeft'

export default class PhaseCard extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    public render() {
        const {
            phaseDescription,
            phaseStatus,
            notes
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
