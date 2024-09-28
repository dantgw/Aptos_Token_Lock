import React from 'react';
import {
    XYChart,
    AnimatedAxis,
    AnimatedGrid,
    Tooltip,
    lightTheme,
    AreaStack,
    AreaSeries
} from '@visx/xychart';
import { TextProps as SVGTextProps } from '@visx/text/lib/Text'; // just for types
import { curveMonotoneX } from 'd3-shape';
import CustomChartBackground from './CustomChartBackground';
import customTheme from './CustomTheme';

// Define your data types
// type DataPoint = {
//     x: Date;  // Date-based x-axis
//     y: number;
// };

// Example date-time-based data
// Define your data type with multiple series
type DataPoint = {
    x: Date;
    [key: string]: any; // Arbitrary number of y values (y1, y2, y3, ..., yN)
};

// Example date-time-based data for multiple curves
const data: DataPoint[] = [
    { x: new Date(2023, 8, 20), y1: 30, y2: 20, y3: 10 },
    { x: new Date(2023, 8, 21), y1: 45, y2: 25, y3: 15 },
    { x: new Date(2023, 8, 22), y1: 50, y2: 30, y3: 20 },
    { x: new Date(2023, 8, 23), y1: 55, y2: 35, y3: 25 },
    { x: new Date(2023, 8, 24), y1: 60, y2: 40, y3: 30 },
];

// Create a dynamic series list based on available y keys
const seriesKeys = Object.keys(data[0]).filter((key) => key !== 'x');

// Accessor for the x-axis
const xAccessor = (d: DataPoint) => d.x;

// Accessors for date-time data
const accessors = {
    xAccessor: (d: any) => d.x,
    yAccessor: (d: any) => d.y,
};




const StyledXYChart: React.FC = () => {
    return (
        <XYChart
            height={400}
            xScale={{ type: 'time' }}  // Use 'time' scale for the x-axis
            yScale={{ type: 'linear' }}
            theme={lightTheme}
        >
            {/* <CustomChartBackground /> */}
            <AnimatedGrid
                columns={true}  // Only show horizontal grid lines
            // numTicks={5}

            />
            <AnimatedAxis orientation="bottom" numTicks={5} />
            <AnimatedAxis orientation="left" label='Circulating Supply' numTicks={5} />

            {/* <AnimatedLineSeries
                dataKey="Smoothed Line"
                data={data}
                {...accessors}
                curve={curveMonotoneX}  // Smooth the line curve
            /> */}

            <AreaStack curve={curveMonotoneX} renderLine={true}>
                {seriesKeys.map((key, i) => (
                    <AreaSeries
                        key={key}
                        dataKey={`Series ${i + 1}`}
                        data={data}
                        xAccessor={xAccessor}
                        yAccessor={(d) => d[key]} // Accessor for each dynamic series
                        fillOpacity={0.4}
                    />
                ))}
            </AreaStack>

            {/* Tooltip */}
            <Tooltip<DataPoint>
                showDatumGlyph
                showVerticalCrosshair
                snapTooltipToDatumX
                snapTooltipToDatumY
                renderTooltip={({ tooltipData }) => (
                    <div>
                        {tooltipData?.nearestDatum && (
                            <div>
                                <strong>Date:</strong> {xAccessor(tooltipData.nearestDatum.datum).toLocaleDateString()}<br />
                                {seriesKeys.map((key) => (
                                    <div key={key}>
                                        <strong>{key}:</strong> {tooltipData.nearestDatum?.datum[key]}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            />
        </XYChart>
    );
};

export default StyledXYChart;
