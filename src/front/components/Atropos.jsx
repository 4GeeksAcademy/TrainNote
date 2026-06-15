import React from "react";
import Atropos from "atropos/react";
import "atropos/css";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import concertImage from "../assets/img/concert.jpg";
import festivalImage from "../assets/img/festival.jpg";
import theaterImage from "../assets/img/theater.jpg";

export const AtroposCard = () => {
    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Featured Events</h2>

            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                slidesPerView={1}
                navigation={true}
                pagination={{ clickable: true }}
                grabCursor={true}
                style={{
                        paddingBottom: "50px"
                      }}
                
                  
            >
                <SwiperSlide>
                    <Atropos>
                        <div className="card">
                            <img src={festivalImage} className="card-img-top" alt="Concert" 
                                style={{
                                        height: "250px",
                                        objectFit: "cover"
                                      }}  />

                            <div className="card-body text-center">
                                <h5 className="card-title">Summer Concert</h5> 
                                <p className="card-text">Madrid - June 25, 2026</p>
                                <button className="btn btn-primary">Buy Ticket</button>
                            </div>
                        </div>
                    </Atropos>
                </SwiperSlide>

                <SwiperSlide>
                    <Atropos>
                        <div className="card">
                            <img src={concertImage} className="card-img-top" alt="Festival" 
                               style={{
                                        height: "250px",
                                        objectFit: "cover"
                                      }}/>

                            <div className="card-body text-center">
                                <h5 className="card-title">Music Festival</h5>
                                <p className="card-text">Barcelona - July 10, 2026</p>
                                <button className="btn btn-primary">Buy Ticket</button>
                            </div>
                        </div>
                    </Atropos>
                </SwiperSlide>

                <SwiperSlide>
                    <Atropos>
                        <div className="card">
                            <img src={theaterImage} className="card-img-top" alt="Theater" 
                              style={{
                                        height: "250px",
                                        objectFit: "cover"
                                     }}/>

                            <div className="card-body text-center">
                                <h5 className="card-title">Theater Night</h5>
                                <p className="card-text">Valencia - August 5, 2026</p>
                                <button className="btn btn-primary">Buy Ticket</button>
                            </div>
                        </div>
                    </Atropos>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};