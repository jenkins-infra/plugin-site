import env from './env';

import fetch from 'isomorphic-fetch';
import querystring from 'querystring';
require('es6-promise').polyfill();

const fetchOptions = { credentials: 'same-origin' };

export default class Api {

  static checkStatus(response) {
    if (response.status >= 300 || response.status < 200) {
      const error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
    return response;
  }

  static parseJSON(response) {
    return response.json();
  }

  static getInitialData() {
    return Promise.all([
      this.getCategories(),
      this.getLabels(),
      this.getInstalled(),
      this.getTrend(),
      this.getUpdated()
    ]).then((data) => {
      return {
        categories: data[0],
        labels: data[1],
        installed: data[2],
        trend: data[3],
        updated: data[4]
      };
    }).catch((err) => {
      console.error('Problem getting initial data'); // eslint-disable-line no-console
      console.error(err); // eslint-disable-line no-console
    });
  }

  static getCategories() {
    const url = `${env.REST_API_URL}/categories`;
    return fetch(url, fetchOptions)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(data => {
        return data.categories;
      }).catch((err) => {
        console.error('Problem getting categories from API'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
      });
  }

  static getLabels() {
    const url = `${env.REST_API_URL}/labels`;
    return fetch(url, fetchOptions)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(data => {
        return data.labels;
      }).catch((err) => {
        console.error('Problem getting labels from API'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
      });
  }

  static getPlugin(name) {
    const url = `${env.REST_API_URL}/plugin/${name}`;
    return fetch(url, fetchOptions)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(data => {
        return data;
      }).catch((err) => {
        console.error(`Problem getting plugin '${name}' from API`, name); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
      });
  }

  static getPlugins(query, categories, labels, sort, page, limit) {
    const data = {
      q: query,
      categories: categories.join(','),
      labels: labels.join(','),
      limit: limit,
      page: page,
      sort: sort
    };
    const url = `${env.REST_API_URL}/plugins?${querystring.stringify(data)}`;
    return fetch(url, fetchOptions)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(data => {
        return data;
      }).catch((err) => {
        console.error('Problem getting plugins from API'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
      });
  }

  static getInstalled() {
    const url = `${env.REST_API_URL}/plugins/installed`;
    return fetch(url, fetchOptions)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(data => {
        return data.plugins;
      }).catch((err) => {
        console.error('Problem getting installed plugins from API'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
      });
  }

  static getUpdated() {
    const url = `${env.REST_API_URL}/plugins/updated`;
    return fetch(url, fetchOptions)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(data => {
        return data.plugins;
      }).catch((err) => {
        console.error('Problem getting updated plugins from API'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
      });
  }

  static getTrend() {
    const url = `${env.REST_API_URL}/plugins/trend`;
    return fetch(url, fetchOptions)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(data => {
        return data.plugins;
      }).catch((err) => {
        console.error('Problem getting trend plugins from API'); // eslint-disable-line no-console
        console.error(err); // eslint-disable-line no-console
      });
  }

}
