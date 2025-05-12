import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
function CustomToast({ t, message, duration }) {
  t.duration = duration;

  return (
    <>
      {message}
      <Button
        size="sm"
        style={{
          fontSize: 13,
          maxHeight: 20,
          marginLeft: 15,
          // backgroundColor: t.type === "success" ? "#61d345" : "#ff4e4e",
          backgroundColor: "transparent",
          borderWidth: 0,
          color: "black",
          padding: 0,
        }}
        onClick={() => toast.dismiss(t.id)}
      >
        <i className="bi bi-x-lg"></i>
      </Button>
    </>
  );
}

export default CustomToast;
