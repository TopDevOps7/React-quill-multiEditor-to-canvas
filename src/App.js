import React, { useState, useEffect } from "react";
import "./styles.css";
// import { FormikQuill } from "./FormikQuill";
import { QuillContainer } from "./QuillContainer";
import { CanvasContainer } from "./CanvasContainer";
import { Provider } from "react-redux";
import { store } from "./redux/store";
// import $ from "jquery";
// import { fabric } from "fabric";

export default function App() {
  // const [value, setValue] = useState("");
  // const [vAlign, setVAlign] = useState([""]);
  // const [content, setContent] = useState([]);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [margin, setMargin] = useState(0);
  const [count, setCount] = useState(0);
  const [canvasJson, setCanvasJson] = useState({});

  useEffect(() => {
    setWidth(450);
    setHeight(660);
    setMargin(30);
    setCount(3);
  });

  const exportJson = (json) => {
    console.log(json);
    setCanvasJson(json);
  };

  return (
    <div className="App">
      <Provider store={store}>
        <div className="d-flex">
          <div className="quill_container">
            <QuillContainer
              width={width ? width : 450}
              height={height ? height : 660}
              margin={margin ? margin : 30}
              count={count ? count : 3}
              exportJson={exportJson}
            />
          </div>
          <div id="canvas_div">
            <CanvasContainer width={width ? width : 450} height={height ? height : 660} json={canvasJson} />
          </div>
        </div>
      </Provider>
    </div>
  );
}
