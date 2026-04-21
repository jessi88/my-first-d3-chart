import React, { useEffect, useMemo, useState } from "react";
import { scaleBand, scaleLinear, max } from "d3";

const Barplot = ({
  data,
  width,
  height,
  barColor,
  barHighlightColor,
  labelColor,
}) => {
  const margin = {
    top: 50,
    right: 25,
    bottom: 30,
    left: 115,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    country: "",
    students: 0,
  });

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const maxStudents = max(data, (d) => d.students) || 0;

  const yScale = useMemo(() => {
    return scaleBand()
      .domain(data.map((d) => d.country))
      .range([0, innerHeight])
      .padding(0.2);
  }, [data, innerHeight]);

  const xScale = useMemo(() => {
    return scaleLinear().domain([0, maxStudents]).range([0, innerWidth]);
  }, [maxStudents, innerWidth]);

  const ticks = xScale.ticks(4);

  const handleMouseEnter = (event, d) => {
    setHoveredCountry(d.country);
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      country: d.country,
      students: d.students,
    });
  };

  const handleMouseMove = (event, d) => {
    setTooltip({
      visible: true,
      x: event.clientX,
      y: event.clientY,
      country: d.country,
      students: d.students,
    });
  };

  const handleMouseLeave = () => {
    setHoveredCountry(null);
    setTooltip((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <div className="chart-wrapper">
      <svg width="100%" height="auto" viewBox={`0 0 ${width} ${height}`}>
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {/* Vertical grid lines + x-axis tick labels */}
          {ticks.map((tick) => {
            const x = xScale(tick);

            return (
              <g key={tick}>
                <line
                  x1={x}
                  x2={x}
                  y1={0}
                  y2={innerHeight}
                  stroke="#f1f5f9"
                  strokeWidth={1}
                />
                <text
                  x={x}
                  y={-8}
                  textAnchor="middle"
                  fontSize={12}
                  fill="#6b7280"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Bottom axis line */}
          <line
            x1={0}
            x2={innerWidth}
            y1={0}
            y2={0}
            stroke="#9ca3af"
            strokeWidth={1}
          />

          {/* Bars */}
          {data.map((d) => {
            const y = yScale(d.country);
            const fullBarWidth = xScale(d.students);
            const animatedWidth = animateIn ? fullBarWidth : 0;
            const isHovered = hoveredCountry === d.country;

            return (
              <g
                key={d.country}
                onMouseEnter={(event) => handleMouseEnter(event, d)}
                onMouseMove={(event) => handleMouseMove(event, d)}
                onMouseLeave={handleMouseLeave}
                style={{ cursor: "pointer" }}
              >
                <rect
                  x={0}
                  y={y}
                  width={animatedWidth}
                  height={yScale.bandwidth()}
                  rx={4}
                  ry={4}
                  fill={isHovered ? barHighlightColor : barColor}
                  opacity={
                    hoveredCountry
                      ? isHovered
                        ? 1
                        : 0.4 // fade non-hovered bars
                      : 0.85
                  }
                  style={{
                    transition:
                      "width 0.8s ease, fill 0.2s ease, opacity 0.2s ease, transform 0.2s ease",
                    transform: isHovered ? "scaleY(1.08)" : "scaleY(1)",
                    transformOrigin: "center",
                    transformBox: "fill-box",
                  }}
                />
                <text
                  x={-10}
                  y={y + yScale.bandwidth() / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                  style={{
                    fontSize: isHovered ? 13.5 : 12,
                    fill: isHovered ? barHighlightColor : labelColor,
                    opacity: hoveredCountry
                      ? isHovered
                        ? 1
                        : 0.5 // fade non-hovered labels
                      : 1,
                    fontWeight: isHovered ? 600 : 400,
                    transition:
                      "font-size 0.2s ease, fill 0.2s ease, opacity 0.2s ease, font-weight 0.2s ease",
                  }}
                >
                  {d.country}
                </text>
              </g>
            );
          })}

          {/* X axis label */}
          <text
            x={xScale(ticks[0])}
            y={-28}
            textAnchor="start"
            dx="-0.3em"
            fontSize={12}
            fill="#374151"
          >
            NUMBER OF STUDENTS
          </text>

          {/* Note below the graph */}
          <text
            x={xScale(ticks[0])}
            y={innerHeight + 20}
            textAnchor="start"
            dx="-0.3em"
            fontSize={12}
            fill="#94a3b8"
          >
            Note: Countries with fewer than 3 enrollments are excluded.
          </text>
        </g>
      </svg>

      {tooltip.visible && (
        <div
          style={{
            position: "fixed",
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            background: "rgba(240, 240, 240, 0.85)",
            color: barHighlightColor,
            padding: "8px 10px",
            borderRadius: "8px",
            fontSize: "12px",
            lineHeight: 1.4,
            pointerEvents: "none",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            whiteSpace: "nowrap",
          }}
        >
          <div>
            <strong>{tooltip.country}</strong>
          </div>
          <div>{tooltip.students} Students</div>
        </div>
      )}
    </div>
  );
};

export default Barplot;
