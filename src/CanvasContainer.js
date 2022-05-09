import React, { useState, useEffect } from "react";
import "./styles.css";
import "./FormikQuill";
import { fabric } from "fabric";
import { useSelector } from "react-redux";

export const CanvasContainer = ({ width, height, json }) => {
  // const json_data = useSelector(({ home }) => home.json);

  useEffect(() => {
    console.log("eeeee", json);
    let canvas = new fabric.Canvas("canvas", {
      top: 0,
      left: 0,
      originY: "top",
      width: width,
      height: height,
      backgroundColor: "white",
    });
    canvas.clear();
    canvas.loadFromJSON(json);
  }, []);

  return (
    <div id="canvas_container" style={{ width: width, height: height }}>
      <canvas id="canvas" width={width} height={height}></canvas>
    </div>
  );
};
