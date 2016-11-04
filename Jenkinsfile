#!/usr/bin/env groovy

node('docker') {

  stage('Checkout') {
    checkout scm
  }

  timestamps {
    stage('Build Docker Image') {
      docker.build('jenkinsciinfra/plugin-site')
    }
  }

}
