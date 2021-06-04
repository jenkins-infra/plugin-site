import React from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import moment from 'moment';

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
    if (!installations) {
        return null;
    }
    const labels = [];
    const data = [];
    const height = 90;
    const length = installations.length;
    installations.slice(length > 12 ? length - 12 : 0, length).forEach((installation) => {
        labels.push(moment.utc(installation.timestamp).format('MMM'));
        data.push(installation.total);
    });
    const lineData = chartData(labels, data);
    return (
        <div style={styles.graphContainer}>
            <Line data={lineData}
                options={options(data)}
                height={height}/>
        </div>
    );
}

LineChart.propTypes = {
    installations: PropTypes.arrayOf(PropTypes.shape({
        timestamp: PropTypes.number,
        total: PropTypes.number
    }))
};

export default LineChart;
