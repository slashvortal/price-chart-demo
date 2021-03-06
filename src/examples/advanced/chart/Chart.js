import React, { useEffect, useRef } from 'react';
import {
  chartInit,
  chartSetCursor,
  chartDraw,
  chartDrawCrosshair,
  chartGetViewModel,
  chartAddEventListener,
  chartRemoveEventListener,
  chartThemes,
  chartDefaultConfig,
} from '@talkrz/price-chart';
import useDimensions from '../../../hooks/useDimensions';

import mouseHandlerZoom from './mouseHandlerZoom';
import useMoveChart from './useMoveChart';
import mouseHandlerCrosshair from './mouseHandlerCrosshair';

import './Chart.css';

export default function Chart({ data, theme, chartType, zoom, setZoom, setChartViewModel, setCursorData }) {
  const config = chartDefaultConfig();
  config.chartType = chartType;

  const contentRef = useRef();
  const canvasBaseRef = useRef();
  const canvasScaleRef = useRef();
  // hook that handles updating width and height according to current dimensions
  // supporting window resize
  const [width, height] = useDimensions(contentRef);

  // prepare handlers for mouse interactions
  const wheelHandler = mouseHandlerZoom(zoom, setZoom);
  const crosshairMoveHandler = mouseHandlerCrosshair(
    canvasBaseRef,
    chartDrawCrosshair,
    chartSetCursor,
  );

  const [offset, chartMoveHandlers] = useMoveChart(
    canvasBaseRef,
    zoom,
    // don't allow to move chart to the past too much
    -data.length + chartGetViewModel().capacity
  );

  const chartState = {
    width,
    height,
    zoom,
    offset,
    config,
    theme: chartThemes()[theme],
  }

  // chart drawing effect
  useEffect(() => {
    if (!data.length) return;
    // init chart view
    chartInit(
      data,
      {
        base: canvasBaseRef.current,
        scale: canvasScaleRef.current,
      },
      chartState
    );

    const onMoveCursor = (cursor) => {
      setCursorData(cursor);
    };
    chartAddEventListener('moveCursor', onMoveCursor);

    // draw chart on the canvas
    chartDraw();

    // retrieve view model containing useful data about displayed chart
    setChartViewModel(chartGetViewModel());

    return () => {
      chartRemoveEventListener('moveCursor', onMoveCursor);
    }
  }, [width, height, theme, chartType, zoom, offset])

  return (
    <div className="Chart" ref={contentRef}>
      <canvas
        ref={canvasBaseRef}
        className="Chart-canvas"
        style={{ width, height }}
      />
      <canvas
        ref={canvasScaleRef}
        className="Chart-canvas-scale"
        style={{ width, height }}
        onMouseMove={(e) => {
          chartMoveHandlers.mouseMoveHandler(e);
          crosshairMoveHandler(e);
        }}
        onWheel={wheelHandler}
        onMouseDown={chartMoveHandlers.mouseDownHanlder}
        onMouseUp={chartMoveHandlers.mouseUpHandler}
        onTouchMove={(e) => {
          chartMoveHandlers.touchMoveHandler(e);
        }}
        onTouchStart={chartMoveHandlers.touchStartHandler}
        onTouchEnd={chartMoveHandlers.touchEndHandler}
        onDragStart={
          // Looks like some browsers have default handler for drag, so let's disable it
          (e) => e.preventDefault()
        }
      />
    </div>
  )
}
