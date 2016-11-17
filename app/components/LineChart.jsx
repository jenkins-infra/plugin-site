import React, { PropTypes } from 'react';
import { Line } from 'react-chartjs';
import moment from 'moment';

const calculateHeight = (total) => {
  if (total > 100000) return 275;
  if (total > 50000) return 250;
  if (total > 25000) return 225;
  if (total > 10000) return 200;
  if (total > 5000) return 175;
  return 150;
};

const chartData = (labels, data) => {
  const lastValue = data[data.length-1];
  let maxValue = null;
  let minValue = null;
  if (lastValue < 100) maxValue = 250;
  else if (lastValue < 250) maxValue = 500;
  else if (lastValue < 500) maxValue = 1000;
  else if (lastValue < 1000) maxValue = 2000;
  else if (lastValue < 2500) maxValue = 5000;
  else if (lastValue < 7500) maxValue = 10000;

  if (lastValue > 5000) minValue = 0;

  return {
    labels: labels,
    datasets: [
      {
        label: 'Installs',
        fillColor: 'rgba(0,220,255,0.3)',
        strokeColor: 'rgba(220,220,220,1)',
        pointColor: 'rgba(220,220,220,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(220,220,220,1)',
        data: data,
      },
      {
        strokeColor: 'rgba(0,0,0,0)',
        pointColor: 'rgba(0,0,0,0)',
        pointStrokeColor: 'rgba(0,0,0,0)',
        label: '',
        data: [minValue]
      },
      {
        label: '',
        data: [maxValue]
      }
    ]
  };
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  scaleShowGridLines: true,
  scaleGridLineColor: 'rgba(0,0,0,.05)',
  scaleGridLineWidth: 1,
  scaleFontSize: 9,
  scaleShowHorizontalLines: true,
  scaleShowVerticalLines: true,
  bezierCurve: true,
  bezierCurveTension: 0.4,
  pointDot: true,
  pointDotRadius: 2,
  pointDotStrokeWidth: 1,
  pointHitDetectionRadius: 10,
  datasetStroke: true,
  datasetStrokeWidth: 2,
  datasetFill: true,
  legendTemplate: '<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>', // eslint-disable-line max-len
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
    })).isRequired
  };

  render() {
    const { installations, total } = this.props;
    const labels = [];
    const data = [];
    const height = calculateHeight(total);
    if (installations) {
      installations.sort((a,b) => {
        a = a.timestamp;
        b = b.timestamp;
        return a < b ? -1 : (a > b ? 1 : 0);
      });
      const length = installations.length;
      installations.slice(length - 12, length).forEach((installation) => {
        labels.push(moment(installation.timestamp).format('MMM'));
        data.push(installation.total);
      });
    }
    const lineData = chartData(labels, data);
    return (
      <div style={styles.graphContainer}>
        <Line data={lineData}
          options={options}
          height={height}
          redraw />
      </div>
    );
  }

}
