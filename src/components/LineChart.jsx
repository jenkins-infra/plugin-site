import React from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import moment from 'moment';

const calculateMinMax = (data) => {
    const maxValue = Math.max(...data);
    // calculate a dynamic value to center the graph
    const scaleDifference = Math.pow(10, maxValue.toString().length-1);
    return {
        min: 0,
        max: Math.ceil((maxValue/scaleDifference) + 0.25)*scaleDifference // plus 0.25 to add more space in the top
    };
};

const chartData = (labels, data) => {
    return {
        labels: labels,
        datasets: [
            {
                label: 'Installs',
                data,
                backgroundColor: 'rgba(0,220,255,0.3)',
                pointBackgroundColor: '#3399cc',
                pointRadius: 2,
                pointHitRadius: 10,
            }
        ]
    };
};

const options = (data) => {
    const {min, max} = calculateMinMax(data);
    return {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
            display: false
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
            xAxes: [{
                ticks: {
                    fontSize: 9,
                }
            }],
            yAxes: [{
                display: false,
                ticks: {
                    min,
                    max,
                    fontSize: 9,
                }
            }]
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
    const height = 80;
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
                height={height}
                redraw />
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
