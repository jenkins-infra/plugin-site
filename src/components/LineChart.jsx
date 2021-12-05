import React from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import {ResizeObserver as ResizeObserverPolyfill} from '@juggle/resize-observer';
const MONTHS = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'May',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Oct',
    10: 'Nov',
    11: 'Dec',
};

const calculateMax = (data) => {
    return 1.2 * Math.max(...data);
};

const chartData = (labels, data) => {
    return {
        labels: labels,
        datasets: [
            {
                label: 'Installs',
                data,
                fill: true,
                backgroundColor: 'rgba(0,220,255,0.3)',
                pointBackgroundColor: '#3399cc',
                pointRadius: 2,
                pointHitRadius: 10,
            }
        ]
    };
};

const options = (data) => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            line: {
                borderWidth: 2,
            },
            point: {
                borderWidth: 1
            }
        },
        scales: {
            x: {
                ticks: {
                    font: {size: '9px'}
                }
            },
            y: {
                min: 0,
                max: calculateMax(data),
                display: false
            }
        }
    };
};

const styles = {
    graphContainer: {
        padding: '0'
    }
};

function LineChart({installations}) {
    if (typeof window !== 'undefined') {
        window.ResizeObserver = window.ResizeObserver || ResizeObserverPolyfill;
    }
    if (!installations?.length) {
        return null;
    }
    const labels = [];
    const data = [];
    const height = 90;
    const length = installations.length;
    installations.slice(length > 12 ? length - 12 : 0, length).forEach((installation) => {
        labels.push(MONTHS[new Date(installation.timestamp).getUTCMonth()]),
        data.push(installation.total);
    });
    const lineData = chartData(labels, data);
    return (
        <div style={styles.graphContainer}>
            <Line data={lineData} options={options(data)} height={height}/>
        </div>
    );
}

LineChart.defaultProps = {
    installations: []
};

LineChart.propTypes = {
    installations: PropTypes.arrayOf(PropTypes.shape({
        timestamp: PropTypes.number,
        total: PropTypes.number
    }))
};

export default LineChart;
