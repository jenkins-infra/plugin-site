#!/usr/bin/env groovy

node('docker') {

  stage('Checkout') {
    checkout scm
  }

  timestamps {

    stage('Build & Test') {
      docker.image("node:6.7").inside {
        sh "npm install"
        sh "npm run build"
      }
      junit allowEmptyResults: true, testResults: '**/junit/*.xml'
    }

    stage('Build Docker Image') {
      docker.build('jenkinsciinfra/plugin-site')
    }
  }

}
