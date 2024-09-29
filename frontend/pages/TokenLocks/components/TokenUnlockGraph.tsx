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
import CustomChartBackground from './CustomChartBackground';
import customTheme from './CustomTheme';
import { DataPoint } from '@/types/types';


interface Props {
    data: DataPoint[];
}

// Linear interpolation function
function interpolateData(data: DataPoint[], keys: string[]): DataPoint[] {
    const result: DataPoint[] = [];

    for (let i = 0; i < data.length - 1; i++) {
        const current = data[i];
        const next = data[i + 1];
        result.push(current);

        // Calculate time difference
        const timeDiff = next.x.getTime() - current.x.getTime();
        const daysDiff = timeDiff / (1000 * 3600 * 24);

        // If the gap is more than 1 day, interpolate
        if (daysDiff > 1) {
            for (let day = 1; day < daysDiff; day++) {
                const interpolatedPoint: DataPoint = {
                    x: new Date(current.x.getTime() + day * 24 * 60 * 60 * 1000)
                };
                keys.forEach(key => {
                    const startValue = (current[key] as number) || 0;
                    const endValue = (next[key] as number) || 0;
                    interpolatedPoint[key] = startValue + (endValue - startValue) * (day / daysDiff);
                });
                result.push(interpolatedPoint);
            }
        }
    }
    result.push(data[data.length - 1]); // Add the last point
    return result;
}

const TokenUnlockGraph: React.FC<Props> = ({ data }) => {

    if (!data || data.length === 0) {
        return <div>No data available for the graph.</div>;
    }

    // Create a dynamic series list based on available y keys
    const seriesKeys = Array.from(new Set(
        data.reduce((keys, obj) => {
            Object.keys(obj).forEach(key => {
                if (key !== 'x') keys.add(key);
            });
            return keys;
        }, new Set<string>())
    ));
    // const seriesKeys = ['y1']

    if (seriesKeys.length === 0) {
        return <div>Invalid data format for the graph.</div>;
    }
    const xAccessor = (d: DataPoint) => d.x;

    return (
        <>
            <XYChart
                height={500}
                xScale={{ type: 'time' }}  // Use 'time' scale for the x-axis
                yScale={{ type: 'linear' }}
                theme={lightTheme}

            >
                {/* <CustomChartBackground /> */}

                <AnimatedGrid
                    columns={true}  // Only show horizontal grid lines
                // numTicks={5}

                />
                <AnimatedAxis orientation="top" label='Token Emissions' hideAxisLine hideTicks hideZero
                    tickLabelProps={() => ({
                        opacity: 0  // This hides the tick labels
                    })}
                />
                <AnimatedAxis orientation="bottom" numTicks={5} />
                <AnimatedAxis
                    orientation="left"
                    labelOffset={0} // Move label further from axis
                />
                {/* <AnimatedAxis orientation="left" label='Circulating Supply' numTicks={5} /> */}

                {/* <AnimatedLineSeries
                dataKey="Smoothed Line"
                data={data}
                {...accessors}
                curve={curveMonotoneX}  // Smooth the line curve
            /> */}

                <AreaStack renderLine={true}>
                    {seriesKeys.map((key, i) => (
                        <AreaSeries
                            key={key}
                            dataKey={`Series ${i + 1}`}
                            data={data}
                            xAccessor={xAccessor}
                            yAccessor={
                                (d: DataPoint) => {
                                    // (d) => d[key]
                                    const value = (d[key] as number) || 0;
                                    // console.log(`Data point for ${key}:`, { x: d.x, y: value });
                                    return value;
                                }
                            } // Accessor for each dynamic series
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
                        // <div>
                        //     {tooltipData?.nearestDatum && (
                        //         <div>
                        //             <strong>Date:</strong> {xAccessor(tooltipData.nearestDatum.datum).toLocaleDateString()}<br />
                        //             {seriesKeys.map((key) => (
                        //                 <div key={key}>
                        //                     <strong>{key}:</strong> {(tooltipData?.nearestDatum?.datum[key as keyof DataPoint] as number | undefined)?.toLocaleString() ?? 'N/A'}
                        //                 </div>
                        //             ))}
                        //         </div>
                        //     )}
                        // </div>
                        <div>
                            {tooltipData?.nearestDatum && (
                                <div>
                                    <strong>Date:</strong> {xAccessor(tooltipData.nearestDatum.datum).toLocaleDateString()}<br />
                                    {seriesKeys.map((key) => (
                                        <div key={key} style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                                            <div
                                                style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    backgroundColor: key, // Assuming the key is a valid color string
                                                    marginRight: '5px'
                                                }}
                                            />
                                            <strong>{`${key}: `}</strong> {(tooltipData?.nearestDatum?.datum[key as keyof DataPoint] as number | undefined)?.toLocaleString() ?? 'N/A'}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                />
            </XYChart>
        </>
    );
};

export default TokenUnlockGraph;
