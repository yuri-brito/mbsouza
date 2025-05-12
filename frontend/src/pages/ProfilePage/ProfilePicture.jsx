import React, { useEffect, useRef, useState } from "react";
import { Button, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { redirect } from "react-router-dom";
// import "./ProfilePicture.css"; // Arquivo CSS para estilização

const ProfilePicture = ({
  alt,
  urlProfileImg,
  loggedUser,
  preview,
  position,
  setPosition,
  imageSize,
  setImageSize,
}) => {
  const [dragging, setDragging] = useState(false);
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });

  const startDrag = (e) => {
    e.preventDefault();
    setDragging(true);
    if (e._reactName === "onTouchStart") {
      setInitialPosition({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    } else {
      setInitialPosition({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    }
  };

  const onDrag = (e) => {
    e.preventDefault();
    if (dragging) {
      if (e._reactName === "onTouchMove") {
        setPosition({
          x: e.touches[0].clientX - initialPosition.x,
          y: e.touches[0].clientY - initialPosition.y,
        });
      } else {
        setPosition({
          x: e.clientX - initialPosition.x,
          y: e.clientY - initialPosition.y,
        });
      }
    }
  };

  const stopDrag = (e) => {
    e.preventDefault();
    setDragging(false);
  };
  const intervalIdRefMenos = useRef(null);
  const buttonRefMenos = useRef(null);
  useEffect(() => {
    const handleMouseDown = () => {
      intervalIdRefMenos.current = setInterval(() => {
        setImageSize((is) => is - 5); // Update state repeatedly
      }, 100); // Repeat every 100 milliseconds
    };

    const handleMouseUp = () => {
      if (intervalIdRefMenos.current !== null) {
        clearInterval(intervalIdRefMenos.current); // Clear the interval
        intervalIdRefMenos.current = null;
      }
    };
    const buttonElement = buttonRefMenos.current;
    buttonElement.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    buttonElement.addEventListener("touchstart", handleMouseDown);
    document.addEventListener("touchend", handleMouseUp);
    return () => {
      buttonElement.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      buttonElement.removeEventListener("touchstart", handleMouseDown);
      document.removeEventListener("touchend", handleMouseUp);
      if (intervalIdRefMenos.current !== null) {
        clearInterval(intervalIdRefMenos.current); // Clear interval on unmount
      }
    };
  }, []);

  const intervalIdRefMais = useRef(null);
  const buttonRefMais = useRef(null);
  useEffect(() => {
    const handleMouseDown = () => {
      intervalIdRefMais.current = setInterval(() => {
        setImageSize((is) => is + 5); // Update state repeatedly
      }, 100); // Repeat every 100 milliseconds
    };

    const handleMouseUp = () => {
      if (intervalIdRefMais.current !== null) {
        clearInterval(intervalIdRefMais.current); // Clear the interval
        intervalIdRefMais.current = null;
      }
    };
    const buttonElement = buttonRefMais.current;
    buttonElement.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    buttonElement.addEventListener("touchstart", handleMouseDown);
    document.addEventListener("touchend", handleMouseUp);
    return () => {
      buttonElement.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      buttonElement.removeEventListener("touchstart", handleMouseDown);
      document.removeEventListener("touchend", handleMouseUp);
      if (intervalIdRefMais.current !== null) {
        clearInterval(intervalIdRefMais.current); // Clear interval on unmount
      }
    };
  }, []);

  return (
    <Row className="d-flex justify-content-center align-items-end">
      <Col className="p-0">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip
              style={{
                position: "absolute",
                fontSize: 12,
              }}
            >
              {`Aumentar tamanho`}
            </Tooltip>
          }
        >
          <Button
            variant="black"
            style={{
              fontWeight: "bold",
              padding: 0,

              height: 25,
              width: 25,
            }}
            disabled={!preview && !urlProfileImg}
            ref={buttonRefMais}
          >
            +
          </Button>
        </OverlayTrigger>
      </Col>
      <Col className="p-0">
        {preview || urlProfileImg ? (
          <div
            className="profile-container"
            onMouseMove={onDrag}
            onMouseUp={stopDrag}
            //   onMouseUpCapture={stopDrag}
            //   onMouseDownCapture={startDrag}
            onMouseLeave={stopDrag}
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            onTouchMove={onDrag}
            onTouchEnd={stopDrag}
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            }}
          >
            <img
              className="profile-picture"
              src={preview ? preview : urlProfileImg}
              alt={alt}
              style={{
                width: imageSize,
                // height: preview || urlProfileImg ? 150 : 100,
                transform: `translate(${position.x}px, ${position.y}px)`,
              }}
            />
          </div>
        ) : (
          <>
            <Col
              className="p-0   d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: "var(--bs-text-color)",
                marginRight: 2,
                width: 100,
                height: 100,
                borderRadius: "50%",
                color: "var(--bs-body-bg)",
                position: "relative",
                fontSize: 30,
              }}
            >
              {loggedUser.userData.nome &&
                loggedUser.userData.nome[0].toUpperCase() +
                  loggedUser.userData.nome
                    .split(" ")
                    .slice(-1)[0][0]
                    .toUpperCase()}
            </Col>
          </>
        )}
      </Col>
      <Col className="p-0">
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip
              style={{
                position: "absolute",
                fontSize: 12,
              }}
            >
              {`Reduzir tamanho`}
            </Tooltip>
          }
        >
          <Button
            variant="black"
            style={{
              fontWeight: "bold",
              height: 25,
              width: 25,
              padding: 0,
            }}
            disabled={!preview && !urlProfileImg}
            ref={buttonRefMenos}
          >
            -
          </Button>
        </OverlayTrigger>
      </Col>
    </Row>
  );
};

export default ProfilePicture;
