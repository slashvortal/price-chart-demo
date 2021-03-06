import React, { useState, useEffect } from 'react';
import ChartContainer from './chart/ChartContainer';
import ChartSidebar from './chart/ChartSidebar';
import './ChartViewAdvanced.css';

export default function ChartViewAdvanced({ parentSetTheme }) {
  const [chartViewModel, setChartViewModel] = useState({
    data: []
  });
  const [zoom, setZoom] = useState(8);
  const [theme, setTheme] = useState('light');
  const [chartType, setChartType] = useState('candlestick');
  const [cursorData, setCursorData] = useState([null, null]);

  function setZoomWithLimit(value) {
    if (value > 13) value = 13;
    if (value < 2) value = 2;
    setZoom(value);
  }

  useEffect(() => {
    parentSetTheme(theme)
  }, [theme])

  return (
    <>
      <div className="ChartViewAdvanced-container">
        <ChartContainer
          zoom={zoom}
          setZoom={setZoomWithLimit}
          theme={theme}
          chartType={chartType}
          setChartViewModel={setChartViewModel}
          setCursorData={setCursorData}
        />
      </div>
      <ChartSidebar
        chartViewModel={chartViewModel}
        cursorData={cursorData}
        theme={theme}
        setTheme={setTheme}
        chartType={chartType}
        setChartType={setChartType}
        zoom={zoom}
        setZoom={setZoom}
      />
    </>
  )
}
