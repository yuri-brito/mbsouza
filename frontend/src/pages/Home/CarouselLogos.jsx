// CarouselLogos.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "./CarouselLogos.css"; // Para o fade nas extremidades
const logoFiles = import.meta.glob("../../assets/clientes/*.jpg", {
  eager: true,
});

// Array de logos fictício (substitua pelos seus logos reais)
const logos = Object.values(logoFiles).map((mod) => mod.default);
// const logos = [
//   "https://via.placeholder.com/150x80?text=Logo+1",
//   "https://via.placeholder.com/150x80?text=Logo+2",
//   "https://via.placeholder.com/150x80?text=Logo+3",
//   "https://via.placeholder.com/150x80?text=Logo+4",
//   "https://via.placeholder.com/150x80?text=Logo+5",
//   "https://via.placeholder.com/150x80?text=Logo+6",
//   "https://via.placeholder.com/150x80?text=Logo+7",
//   "https://via.placeholder.com/150x80?text=Logo+8",
//   "https://via.placeholder.com/150x80?text=Logo+9",
//   "https://via.placeholder.com/150x80?text=Logo+10",
//   "https://via.placeholder.com/150x80?text=Logo+11",
//   "https://via.placeholder.com/150x80?text=Logo+12",
// ];

function CarouselLogos() {
  return (
    <div
      className="carousel-container"
      style={{
        borderBlock: "1px solid var(--bs-text-color)",
        paddingBlock: 20,
        // paddingInline: 100,
        // boxShadow:
        //   " 0 -5px 15px rgba(0, 0, 0, 0.35) , 0 5px 15px rgba(0, 0, 0, 0.35)",
      }}
    >
      <Swiper
        modules={[Autoplay]} // Aqui passa o módulo
        slidesPerView={5}
        spaceBetween={80}
        loop={true}
        autoplay={{ delay: 0, disableOnInteraction: false }}
        speed={3000}
        grabCursor={true}
        allowTouchMove={true}
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {logos.map((logo, index) => (
          <SwiperSlide key={index}>
            <img src={logo} alt={`Logo ${index + 1}`} className="logo-img" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default CarouselLogos;
