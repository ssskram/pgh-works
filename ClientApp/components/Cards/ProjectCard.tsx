
// carousel on project page

import * as React from 'react'
import Slider from "react-slick";
import RightArrow from '../Utilities/CarouselRight'
import LeftArrow from '../Utilities/CarouselLeft'

export default class ProjectCard extends React.Component<any, any> {

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    public render() {
        const {
            projectManager,
            projectMembers,
            projectDepartment,
            projectDescription,
            projectStatus,
            notes
        } = this.props.project

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

                        {projectDescription &&
                            <div className='col-md-12 text-center'>
                                <h3><u>Description</u></h3>
                                <h2>{projectDescription}</h2>
                            </div>
                        }
                        <div className='col-md-12 text-center'>
                            <h3><u>Project status</u></h3>
                            <h2>{projectStatus}</h2>
                        </div>
                        <div className='col-md-12 text-center'>
                            <h3><u>Department</u></h3>
                            <h2>{projectDepartment}</h2>
                        </div>
                        <div className='col-md-12 text-center'>
                            <h3><u>Project manager</u></h3>
                            <h2>{projectManager}</h2>
                        </div>
                        {projectMembers &&
                            <div className='col-md-12 text-center'>
                                <h3><u>Project members</u></h3>
                                <h2>{projectMembers}</h2>
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
