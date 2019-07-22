import React, { PropTypes } from 'react';
import { Line } from 'react-chartjs-2';
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
  const lastValue = data[data.length-1];
  let maxValue = undefined;
  let minValue = undefined;
  if (lastValue < 100) maxValue = 250;
  else if (lastValue < 250) maxValue = 500;
  else if (lastValue < 500) maxValue = 1000;
  else if (lastValue < 1000) maxValue = 2000;
  else if (lastValue < 2500) maxValue = 5000;
  else if (lastValue < 7500) maxValue = 10000;

  if (lastValue > 5000) minValue = 0;

  return {
    min: minValue,
    max: maxValue
  };
}

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
  const { min, max } = calculateMinMax(data)
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

export default class LineChart extends React.PureComponent {

  static propTypes = {
    total: PropTypes.number.isRequired,
    installations: PropTypes.arrayOf(PropTypes.shape({
      timestamp: PropTypes.number,
      total: PropTypes.number
    }))
  };

  render() {
    const { installations, total } = this.props;
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

}
