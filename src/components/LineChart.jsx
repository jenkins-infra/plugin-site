import React from 'react';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import moment from 'moment';

const calculateHeight = (total) => {
    if (total > 100000) return 275;
    if (total > 50000) return 250;
    if (total > 25000) return 225;
    if (total > 10000) return 200;
    if (total > 5000) return 175;
    return 150;
};

const calculateMinMax = (data) => {
    const minValue = Math.min(...data);
    const maxValue = Math.max(...data);
    // calculate a dynamic value to center the graph
    const scaleDifference = Math.pow(10, maxValue.toString().length-1);
    return {
        min: parseInt(minValue/scaleDifference)*scaleDifference,
        max: parseInt((maxValue/scaleDifference)+1)*scaleDifference // plus 1 to add more space in the top
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

function LineChart({installations, total}) {
    if (!installations) {
        return null;
    }
    const labels = [];
    const data = [];
    const height = calculateHeight(total);
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
    total: PropTypes.number.isRequired,
    installations: PropTypes.arrayOf(PropTypes.shape({
        timestamp: PropTypes.number,
        total: PropTypes.number
    }))
};

export default LineChart;
