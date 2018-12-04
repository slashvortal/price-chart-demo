import React, { useState, useEffect } from 'react';
import ChartContainer from './chart/ChartContainer';
import ChartSidebar from './chart/ChartSidebar';
import './ChartView.css';

const styles = {
  light: {
    colorBackground: '#fff',
    colorBear: '#ff4444',
    colorBull: '#fff',
    colorBearBorder: '#ff4444',
    colorBullBorder: '#000',
    colorGrid: '#f4f4f4',
    colorBorder: '#e8e8e8',
    colorScale: '#666',
    colorCrosshair: '#ccc',
  },
  dark: {
    colorBackground: '#000',
    colorBear: '#aa2222',
    colorBull: '#000',
    colorBearBorder: '#aa2222',
    colorBullBorder: '#00aa22',
    colorGrid: '#222',
    colorBorder: '#333',
    colorScale: '#aaa',
    colorCrosshair: '#666',
  },
}

export default function ChartView({ parentSetTheme }) {
  const [chartViewModel, setChartViewModel] = useState({
    data: []
  });
  const [zoom, setZoom] = useState(8);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    parentSetTheme(theme)
  }, [theme])

  return (
    <>
      <div className="ChartView-chart-container">
        <ChartContainer zoom={zoom} setZoom={setZoom} style={styles[theme]} setChartViewModel={setChartViewModel} />
      </div>
      <ChartSidebar
        chartViewModel={chartViewModel}
        theme={theme}
        setTheme={setTheme}
        zoom={zoom}
        setZoom={setZoom}
      />
    </>
  )
}
