import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import axios from "axios";
import { config } from "../../../config";

const Carosel = () => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,  // Show 1 slide at a time
    slidesToScroll: 1, // Scroll 1 slide at a time
    autoplay: true,       
    autoplaySpeed: 3000, 
  };

  const [slider, setSlider] = useState([]);

  const apiUrl = config.apiBaseUrl;
  const baseUrl = config.customUrl;

  useEffect(() => {
    axios.get(`${apiUrl}/sliders`)
      .then(response => {
        setSlider(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the slider!", error);
      });
  }, []); // Empty dependency array to only fetch once

  return (
    <div className="max-w-screen-2xl mx-auto lg:mt-4">
      <Slider {...settings}>
        {slider.map((slide) => (
          <div key={slide.id} className="flex justify-center" style={{ minWidth: "100%" }}>
            <div className="relative w-full">
              <img 
                className="w-full object-cover h-[200px] lg:h-[500px]" 
                src={`${baseUrl}${slide.slider_image}`} 
                alt={slide.slider_hook} 
              />
              
              {/* Black overlay with opacity */}
              <div className="absolute inset-0 bg-black opacity-50"></div>
    
              {/* Text content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-center text-red-950">
                <h1 className="text-2xl lg:text-2xl my-4 text-white font-bold">{slide.slider_hook}</h1>
                <p className="text-white text-sm md:text-md lg:text-lg">{slide.slider_story}</p>
                <a href='/shop' className="rounded h-12 bg-gradient-to-r from-purple-500 to-pink-500 p-2 my-3 text-white font-extrabold hover:scale-110">
                  {slide.slider_buttonText}
                </a>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carosel;
