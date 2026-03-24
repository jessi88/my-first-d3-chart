import React, { useEffect, useMemo, useState } from "react";
import { scaleBand, scaleLinear, max } from "d3";

const Barplot = ({
  data,
  width,
  height,
  barColor,
  barHighlightColor,
  labelColor,
  labelHighlightColor,
}) => {
  const margin = {
    top: 0,
    right: 20,
    bottom: 0,
    left: 100,
  };

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const yScale = useMemo(() => {
    return scaleBand()
      .domain(data.map((d) => d.country))
      .range([0, innerHeight])
      .padding(0.2);
  }, [data, innerHeight]);

  const xScale = useMemo(() => {
    return scaleLinear()
      .domain([0, max(data, (d) => d.students) || 0])
      .range([0, innerWidth]);
  }, [data, innerWidth]);

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {data.map((d) => {
          const y = yScale(d.country);
          const fullBarWidth = xScale(d.students);
          const animatedWidth = animateIn ? fullBarWidth : 0;
          const isHovered = hoveredCountry === d.country;

          return (
            <g
              key={d.country}
              onMouseEnter={() => setHoveredCountry(d.country)}
              onMouseLeave={() => setHoveredCountry(null)}
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
                opacity={isHovered ? 1 : 0.85}
                style={{
                  transition:
                    "width 0.8s ease, fill 0.2s ease, opacity 0.2s ease",
                }}
              />
              <text
                x={-10}
                y={y + yScale.bandwidth() / 2}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={12}
                fill={isHovered ? labelHighlightColor : labelColor}
                style={{ transition: "fill 0.2s ease" }}
              >
                {d.country}
              </text>
              <text
                x={animatedWidth + 5}
                y={y + yScale.bandwidth() / 2}
                dominantBaseline="middle"
                fontSize={12}
                fill={isHovered ? labelHighlightColor : labelColor}
                style={{ transition: "fill 0.2s ease" }}
              >
                {d.students}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default Barplot;
