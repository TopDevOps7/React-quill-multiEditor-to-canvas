import React, { useState, useEffect } from "react";
import "./styles.css";
import "./FormikQuill";
import { FormikQuill } from "./FormikQuill";
import $ from "jquery";
import { fabric } from "fabric";

export default function App() {
  const [value, setValue] = useState("");
  const [vAlign, setVAlign] = useState([]);
  const [content, setContent] = useState([]);
  useEffect(() => {
    setVAlign(() => ["top", "top", "top"]);
    setContent(() => [{}, {}, {}]);
    if (localStorage.getItem("status") === "load") {
      setVAlign(() => JSON.parse(localStorage.getItem("align")));
      setContent(() => JSON.parse(localStorage.getItem("content")));

      let canvas = new fabric.Canvas("canvas", {
        top: 0,
        left: 0,
        originY: "top",
        width: 450,
        height: 660,
        backgroundColor: "white",
      });
      canvas.clear();
      canvas.loadFromJSON(JSON.parse(localStorage.getItem("canvasJson")));
    } else {
      if (localStorage.getItem("align") === null)
        localStorage.setItem("align", JSON.stringify(["top", "top", "top"]));
      if (localStorage.getItem("content") === null)
        localStorage.setItem("content", JSON.stringify([{}, {}, {}]));
    }
  }, []);

  const onChange = (id, name, editor, ref) => {
    if ($(`#${name} .ql-container`).height() > 200) {
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
    let canvas = new fabric.Canvas("canvas", {
      top: 0,
      left: 0,
      originY: "top",
      width: 450,
      height: 660,
      backgroundColor: "white",
      selectable: false,
    });
    canvas.clear();
    let line_exp = /\n/;
    let canvas_items = [];
    let fontsize_list = {
      normal: 14,
      small: 10,
      large: 20,
      huge: 32,
    };
    for (let c_index = 0; c_index < content.length; c_index++) {
      let prev_box;
      let t_Idx = 0;
      let t_box = [];
      t_box[0] = { align: "left", lines: [], attr: [] };
      const cont_item = content[c_index];
      if (cont_item.length) {
        let prev_line = [];
        let prev_attr = [];
        for (let index = 0; index < cont_item.length; index++) {
          if (!cont_item[index].hasOwnProperty("attributes")) {
            cont_item[index].attributes = { font: "Arial", size: "normal" };
          }
          let cont = cont_item[index];
          let str = cont.insert.toString();
          let t_attr = cont.attributes;
          if (t_attr.hasOwnProperty("align")) {
            //new aligned line
            if (t_box[t_Idx].align === t_attr.align) {
              if (prev_line.length)
                for (let i = 0; i < prev_line.length; i++) {
                  let line = prev_line[i];
                  if (line.length) {
                    t_box[t_Idx].lines.push(line);
                    t_box[t_Idx].attr.push(prev_attr[i]);
                  }
                }
            } else {
              if (t_box[t_Idx].lines.length) {
                if (
                  t_box[t_Idx].lines[t_box[t_Idx].lines.length - 1].split(
                    line_exp
                  )[
                    t_box[t_Idx].lines[t_box[t_Idx].lines.length - 1].split(
                      line_exp
                    ).length - 1
                  ].length === 0
                ) {
                  t_box[t_Idx].lines[t_box[t_Idx].lines.length - 1] = t_box[
                    t_Idx
                  ].lines[t_box[t_Idx].lines.length - 1].slice(0, -1);
                }
                t_Idx++;
              }
              if (str.split(line_exp).length > 2) {
                for (let j = 0; j < str.split(line_exp).length - 2; j++)
                  prev_line[0] = prev_line[0] + "\n";
              }
              t_box[t_Idx] = {
                align: t_attr.align,
                lines: prev_line,
                attr: prev_attr,
              };
            }
            prev_line = [];
            prev_attr = [];
            t_Idx++;
            t_box[t_Idx] = {
              align: "left",
              lines: [],
              attr: [],
            };
          } else {
            // no new aligned line
            if (str.split(line_exp).length > 1) {
              if (prev_line.length) {
                for (let id = 0; id < prev_line.length; id++) {
                  t_box[t_Idx].lines.push(prev_line[id]);
                  t_box[t_Idx].attr.push(prev_attr[id]);
                }
              }
              prev_line = [];
              prev_attr = [];
              let lines = str.split(line_exp);
              if (lines[lines.length - 1].length !== 0) {
                prev_line.push(lines[lines.length - 1]);
                prev_attr.push(t_attr);
              }
              t_box[t_Idx].align = "left";
              if (lines[lines.length - 1].length === 0)
                t_box[t_Idx].lines.push(str);
              else
                t_box[t_Idx].lines.push(
                  str.slice(0, -lines[lines.length - 1].length)
                );

              t_box[t_Idx].attr.push(t_attr);
            } else {
              prev_line.push(str);
              prev_attr.push(t_attr);
            }
          }
        }
      }
      let canvasLength = 0;
      if (t_box.length) {
        for (let t_index = 0; t_index < t_box.length; t_index++) {
          let block = t_box[t_index];
          let chars = new fabric.Textbox("", {
            originY: "top",
            textAlign: block.align,
            top: canvasLength > 0 ? prev_box.height + 3 + prev_box.top : 0,
            width: 420,
            left: 15,
            lineHeight: 1.2,
            fontFamily: "Times New Roman",
            fontWeight: "normal",
            fontSize: 14,
            backgroundColor: "white",
            splitByGrapheme: true,
            selectable: false,
          });
          prev_box = chars;
          let letterLength = 0;
          if (block.lines.length) {
            for (let i = 0; i < block.lines.length; i++) {
              let line = block.lines[i];
              chars.insertChars(line, null, letterLength);
              let style = {
                fontFamily: block.attr[i].hasOwnProperty("font")
                  ? block.attr[i].font
                  : "Arial",
                fontSize: block.attr[i].hasOwnProperty("size")
                  ? fontsize_list[block.attr[i].size]
                  : 14,
                textAlign: block.attr[i].hasOwnProperty("align")
                  ? block.attr[i].align
                  : "left",
                fill: block.attr[i].hasOwnProperty("color")
                  ? block.attr[i].color
                  : "black",
                textBackgroundColor: block.attr[i].hasOwnProperty("background")
                  ? block.attr[i].background
                  : "white",
                underline: block.attr[i].hasOwnProperty("underline")
                  ? block.attr[i].underline
                  : false,
                fontStyle: block.attr[i].hasOwnProperty("italic")
                  ? "italic"
                  : "normal",
                fontWeight: block.attr[i].hasOwnProperty("bold")
                  ? "bold"
                  : "normal",
              };
              chars.setSelectionStyles(
                style,
                letterLength,
                letterLength + line.length
              );
              letterLength += line.length;
            }
          }

          canvas.add(chars);
          canvasLength++;
        }
      }
      let top = 15;
      let group = new fabric.Group(canvas.getObjects(), {
        originY: "top",
        originX: "left",
        backgroundColor: "white",
        selectable: false,
      });
      if (vAlign[c_index] === "top") top = 15;
      else if (vAlign[c_index] === "center") top = (220 - group.height) / 2;
      else top = 220 - group.height;

      // canvas.clear();
      group.top = top + 220 * c_index;
      canvas.add(group);
      canvas_items.push(group.getObjects());
      group.destroy();
      canvas.clear();
    }

    for (var i = 0; i < canvas_items.length; i++) {
      for (let j = 0; j < canvas_items[i].length; j++) {
        canvas.add(canvas_items[i][j]);
      }
    }
    canvas.renderAll();
    let canvasJson = canvas.toJSON();
    localStorage.setItem("canvasJson", JSON.stringify(canvasJson));
    console.log(JSON.stringify(canvasJson));
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
    <div className="App">
      <div className="d-flex">
        <div className="quill_container">
          {["editor-0", "editor-1", "editor-2"].map((name, index) => (
            <div id={name} key={name}>
              <FormikQuill
                id={index}
                name={name}
                value={value}
                align={vAlign[index]}
                onChange={onChange}
                onChangeAlign={alignText}
                onBlur={onBlur}
              />
              <br />
            </div>
          ))}
        </div>
        <div id="canvas_div">
          <button onClick={onSave}>SAVE</button>
          <button onClick={onLoad}>LOAD</button>
          <div id="canvas_container">
            <canvas id="canvas" width="450" height="660"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
