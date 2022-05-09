import React, { useState, useEffect } from "react";
import $ from "jquery";
import { fabric } from "fabric";
import { FormikQuill } from "./FormikQuill";
import { Converter } from "./Converter";
// import { useDispatch } from "react-redux";
// // import { saveJson } from "./redux/actions/home";
// import { saveJson } from "./redux/actions/home";

export const QuillContainer = ({
  width,
  height,
  margin,
  count,
  exportJson,
}) => {
  const [value, setValue] = useState("");
  const [vAlign, setVAlign] = useState([]);
  const [quillnames, setQuillNames] = useState([]);
  const [content, setContent] = useState([]);
  // const dispatch = useDispatch();

  useEffect(() => {
    let aligns = [];
    let names = [];
    let contents = [];
    for (let i = 0; i < count; i++) {
      aligns.push("top");
      names.push("editor-" + i);
      contents.push({});
    }
    setVAlign(() => aligns);
    setQuillNames(() => names);
    setContent(() => contents);
    if (localStorage.getItem("status") === "load") {
      setVAlign(() => JSON.parse(localStorage.getItem("align")));
      setContent(() => JSON.parse(localStorage.getItem("content")));
    } else {
      if (localStorage.getItem("align") === null)
        localStorage.setItem("align", JSON.stringify(vAlign));
      if (localStorage.getItem("content") === null)
        localStorage.setItem("content", JSON.stringify(content));
    }
  }, []);

  const onChange = (id, name, editor, ref) => {
    if (
      $(`#${name} .ql-container`).height() >
      (height - margin * (count - 1)) / count
    ) {
      ref.current.getEditor().setContents(content[id]);
    } else {
      setContent((item) =>
        item.map((cont, i) => (i === id ? editor.getContents().ops : cont))
      );
    }
  };
  const onBlur = () => {};

  const onSave = () => {
    localStorage.setItem("align", JSON.stringify(vAlign));
    localStorage.setItem("content", JSON.stringify(content));
    localStorage.setItem("status", "save");
    let canvasJson = Converter(content, vAlign, width, height, count, margin);
    exportJson(canvasJson);
    // dispatch(saveJson(canvasJson));
  };

  const onLoad = () => {
    localStorage.setItem("status", "load");
    location.reload();
  };

  const alignText = (type, index) => {
    $(`#editor-${index} .text-editor`).removeClass("top");
    $(`#editor-${index} .text-editor`).removeClass("center");
    $(`#editor-${index} .text-editor`).removeClass("bottom");
    $(`#editor-${index} .text-editor`).addClass(type);
    setVAlign((aligns) =>
      aligns.map((align, i) => (i === index ? type : align))
    );
  };
  return (
    <div className="quill_container" style={{ width: width }}>
      <button className="processBTN" onClick={onSave}>
        Save
      </button>
      <button className="processBTN" onClick={onLoad}>
        Load
      </button>
      {quillnames.map((name, index) => (
        <div id={name} key={name}>
          <FormikQuill
            id={index}
            name={name}
            value={value}
            align={vAlign[index]}
            width={width}
            height={(height - margin * (count - 1)) / count}
            onChange={onChange}
            onChangeAlign={alignText}
            onBlur={onBlur}
          />
          <br />
        </div>
      ))}
    </div>
  );
};
