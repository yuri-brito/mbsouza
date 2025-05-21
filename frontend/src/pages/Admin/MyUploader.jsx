import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import api from "../../api/api";

const MyUploader = ({ files, setFiles, setDeletedFiles }) => {
  const maxSize = 1024 * 1024 * 2; // 2MB

  const onDrop = useCallback(
    (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => file.size <= maxSize);

      const previews = validFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          fromServer: false,
        })
      );

      setFiles((prev) => [...prev, ...previews]);
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [],
      "image/jpeg": [],
    },
    onDrop,
    multiple: true,
    maxSize,
  });

  const handleRemove = (indexToRemove) => {
    const fileToRemove = files[indexToRemove];

    if (fileToRemove.fromServer) {
      setDeletedFiles((prev) => [...prev, fileToRemove]);
    } else {
      URL.revokeObjectURL(fileToRemove.preview);
    }

    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(indexToRemove, 1);
      return newFiles;
    });
  };

  return (
    <>
      <div
        {...getRootProps()}
        style={{
          border: "2px dashed #999",
          padding: 20,
          textAlign: "center",
          borderRadius: 8,
          cursor: "pointer",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Largue os arquivos aqui ...</p>
        ) : (
          <p>Arraste e largue os arquivos aqui, ou clique para selecionar</p>
        )}
      </div>

      <div className="d-flex flex-wrap mt-3 gap-3">
        {files.map((file, index) => (
          <div
            key={index}
            style={{
              position: "relative",
              display: "inline-block",
              width: 100,
              height: 100,
              marginTop: 15,
            }}
          >
            <img
              src={file.preview}
              alt={file.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              style={{
                position: "absolute",
                top: -8,
                right: -8,
                backgroundColor: "red",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: 20,
                height: 20,
                cursor: "pointer",
                fontSize: 12,
                lineHeight: "20px",
                textAlign: "center",
                padding: 0,
              }}
            >
              ×
            </button>
            <p
              className="text-truncate"
              style={{ fontSize: 12, textAlign: "center", marginTop: 4 }}
            >
              {file.name}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyUploader;
