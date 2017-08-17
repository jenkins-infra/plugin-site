#!/usr/bin/env groovy

node('docker') {

  stage('Checkout') {
    checkout scm
  }

  timestamps {

    stage('Build & Test') {
      docker.image("kkarczmarczyk/node-yarn:6.9").inside {
        sh "yarn"
        sh "yarn build"
        sh "yarn test"
      }
      junit allowEmptyResults: true, testResults: '**/junit/*.xml'
    }

    stage('Build Docker Image') {
      docker.build('jenkinsciinfra/plugin-site')
    }
  }

}
