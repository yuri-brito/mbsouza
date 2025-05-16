import React from "react";

import { Image } from "react-bootstrap";
import wp from "../assets/wp.png";

const Whatsapp = (props) => {
  return (
    <a
      href="https://wa.me/5521969991819?text=Ol%C3%A1%2C%20estou%20interessado%20em%20seus%20produtos."
      target="_blank"
      className="link-zap"
      style={{
        position: "fixed",
        top: 150,
        right: 10,
        zIndex: 999,
        width: "10vw",
      }}
    >
      <Image
        width={"100%"}
        style={{ borderRadius: 12, maxWidth: 60, minWidth: 25 }}
        src={wp}
        alt="wp"
      />
    </a>
  );
};

export default Whatsapp;
