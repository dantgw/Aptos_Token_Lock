import {
    buildChartTheme,
    lightTheme
} from '@visx/xychart';
const customTheme = lightTheme;
customTheme.gridStyles = { opacity: 1 };
// customTheme = buildChartTheme({
//     backgroundColor: '#f09ae9',
//     colors: ['rgba(255,231,143,0.8)', '#6a097d', '#d6e0f0'],
//     gridColor: '#336d88',
//     gridStyles: { opacity: 0.3 },
//     gridColorDark: '#1d1b38',
//     svgLabelBig: { fill: '#1d1b38' },
//     tickLength: 8,
// });

export default customTheme;