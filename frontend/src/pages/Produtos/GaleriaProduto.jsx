import React, { useState, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./GaleriaProduto.css"; // CSS personalizado
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

export default function GaleriaProduto({ imagens }) {
  const [imagemSelecionada, setImagemSelecionada] = useState(imagens[0]);
  const swiperRef = useRef(null);
  const [direcao, setDirecao] = useState(""); // Nova direção
  const [imagemAnterior, setImagemAnterior] = useState(null);
  const handleImagemClick = (novaImagem) => {
    if (novaImagem === imagemSelecionada) return;

    // 🆕 Define direção e imagem anterior
    setImagemAnterior(imagemSelecionada);
    setDirecao(
      imagens.indexOf(novaImagem) > imagens.indexOf(imagemSelecionada)
        ? "direita"
        : "esquerda"
    );
    setImagemSelecionada(novaImagem);

    // Remove imagem anterior após animação
    setTimeout(() => {
      setImagemAnterior(null);
    }, 300);
  };
  return (
    <div className="galeria-container">
      <div className={`imagem-principal`}>
        <InnerImageZoom
          src={imagemSelecionada}
          zoomSrc={imagemSelecionada}
          zoomType="hover"
          zoomPreload={true}
          zoomScale={1.5}
          alt="Imagem do Produto"
        />
      </div>

      <div className="miniaturas-container">
        <button
          className="botao-navegacao-prev "
          onClick={() => swiperRef.current?.slidePrev()}
        ></button>

        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          modules={[Navigation]}
          slidesPerView={imagens.length < 4 ? imagens.length : 4} // 🆕 Ajuste para exibir 4 miniaturas no desktop
          spaceBetween={0} // 🆕 Aumenta o espaçamento entre miniaturas
          //   centeredSlides={false} // 🆕 Evita centralizar demais
          className="miniaturas-swiper"
          //   freeMode={true}
          //   breakpoints={{
          //     0: { slidesPerView: 3 },
          //     480: { slidesPerView: 4 },
          //     768: { slidesPerView: 5 },
          //   }}
        >
          {imagens.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`Miniatura ${index + 1}`}
                className={`miniatura ${
                  img === imagemSelecionada ? "ativa" : ""
                }`}
                onClick={() => handleImagemClick(img)}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <button
          className="botao-navegacao-next "
          onClick={() => swiperRef.current?.slideNext()}
        ></button>
      </div>
    </div>
  );
}
