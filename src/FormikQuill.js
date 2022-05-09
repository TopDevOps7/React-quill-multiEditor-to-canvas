import React, { useEffect, useMemo } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import IconTop from "./Icons/IconTop";
import IconMiddle from "./Icons/IconMiddle";
import IconBottom from "./Icons/IconBottom";

export const FormikQuill = ({
  id,
  name,
  value,
  align,
  width,
  height,
  onChange,
  onChangeAlign,
  onBlur,
}) => {
  const quillRef = React.useRef();
  useEffect(() => {
    if (
      localStorage.getItem("status") === "load" &&
      localStorage.getItem("content") !== null
    ) {
      quillRef.current
        .getEditor()
        .setContents(JSON.parse(localStorage.getItem("content"))[id]);
    }
  }, []);
  const CustomToolbar = () => (
    <div id={`toolbar-${id}`}>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <select
        className="ql-size"
        defaultValue={""}
        onChange={(e) => e.persist()}
      >
        {["small", "false", "large", "huge"].map((value, i) => (
          <option key={value} value={value} />
        ))}
      </select>
      <select className="ql-color"></select>
      <select className="ql-background"></select>
      <select className="ql-align"></select>
      <div className="d-flex">
        <div className="toolbar-item" onClick={() => onChangeAlign("top", id)}>
          <IconTop />
        </div>
        <div
          className="toolbar-item"
          onClick={() => onChangeAlign("center", id)}
        >
          <IconMiddle />
        </div>
        <div
          className="toolbar-item"
          onClick={() => onChangeAlign("bottom", id)}
        >
          <IconBottom />
        </div>
      </div>
    </div>
  );

  const handleChange = (e, editor) => {
    onChange(id, name, editor, quillRef);
  };

  const handleBlur = () => {
    onBlur(name, true);
  };

  const quillModules = useMemo(() => {
    return {
      toolbar: {
        container: `#toolbar-${id}`,
        handlers: {
          preview: function (value) {
            const html = this.quill.root.innerHTML;
          },
        },
      },
    };
  }, [id]);

  const quillFormats = [
    "bold",
    "italic",
    "underline",
    "size",
    "color",
    "background",
    "align",
  ];

  return (
    <>
      <div className={`text-editor ${align}`}>
        {CustomToolbar(id)}
        <ReactQuill
          ref={quillRef}
          style={{ backgroundColor: "white", width: width, height: height }}
          theme="snow"
          defaultValue={value}
          onChange={(e, delta, source, editor) => {
            handleChange(e, editor);
          }}
          onBlur={handleBlur}
          modules={quillModules}
          formats={quillFormats}
        />
      </div>
    </>
  );
};
