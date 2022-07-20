import React from "react";
import { Link } from "react-router-dom";
import { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/scss";
import "swiper/scss/navigation";
import "swiper/scss/pagination";
import img1 from "../../assets/images/box-item/img_item6.jpg";
import img2 from "../../assets/images/box-item/img_item7.jpg";
import img3 from "../../assets/images/box-item/img_item8.jpg";
import shape1 from "../../assets/images/backgroup-secsion/bg-gradient1.png";
import shape2 from "../../assets/images/backgroup-secsion/bg-gradient2.png";
import shape3 from "../../assets/images/backgroup-secsion/bg-gradient3.png";
import "./sliderStyle.css";

const SliderStyle4 = () => {
  return (
    <div>
      <section className="flat-title-page style3 mainslider">
        <img className="bgr-gradient gradient1" src={shape1} alt="Axies" />
        <img className="bgr-gradient gradient2" src={shape2} alt="Axies" />
        <img className="bgr-gradient gradient3" src={shape3} alt="Axies" />
        <div className="overlay"></div>
        <div className="themesflat-container">
          <div className="wrap-heading flat-slider flex text-center">
            <div className="header-content">
              <h2 className="heading mt-15">Discover Collect</h2>
              <h1 className="heading mb-style">
                <span className="tf-text s1">Buy &amp; Sell Extraordinary</span>
              </h1>
              <h1 className="heading">MetFx NFT's</h1>
              <p className="sub-heading mt-19 mb-40">
                Build your NFT inventory and connect through the gateway to
                MetFX Metaverse.
              </p>
              {/* <div className="flat-bt-slider flex style2 d-block m-auto">
                <Link
                  to="/explore-01"
                  className="sc-button header-slider style style-1 rocket fl-button pri-1"
                >
                  <span>Explore</span>
                </Link>
                <Link
                  to="/create-item"
                  className="sc-button header-slider style style-1 note fl-button pri-1"
                >
                  <span>Create</span>
                </Link>
              </div> */}
            </div>
            {/* <Swiper
                                modules={[ Autoplay ]}
                                direction={"vertical"}
                                spaceBetween={25}
                                slidesPerView={5}
                                loop
                                autoplay={{
                                    delay: 1,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed= {2000}
                            >
                                <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>

                            </Swiper> */}
            {/* <Swiper
                                modules={[ Autoplay ]}
                                direction={"vertical"}
                                spaceBetween={25}
                                slidesPerView={5}
                                loop
                                autoplay={{
                                    delay: 1,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed= {1800}
                            >
                                <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>

                            </Swiper> */}
            {/* <Swiper
                                modules={[ Autoplay ]}
                                direction={"vertical"}
                                spaceBetween={25}
                                slidesPerView={5}
                                loop
                                autoplay={{
                                    delay: 1,
                                    disableOnInteraction: false,
                                    pauseOnMouseEnter: true,
                                }}
                                speed= {2200}
                            >
                                <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img3} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img2} alt="Axies" /></SwiperSlide>
                                <SwiperSlide><img src={img1} alt="Axies" /></SwiperSlide>

                            </Swiper> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SliderStyle4;
