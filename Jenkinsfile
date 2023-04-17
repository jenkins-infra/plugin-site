pipeline {
  environment {
    GET_CONTENT = "true"
    NODE_ENV = "production"
    HOME = "/tmp"
    TZ = "UTC"
  }

  agent {
    label 'docker&&linux'
  }

  options {
    timeout(time: 60, unit: 'MINUTES')
    ansiColor('xterm')
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5')
  }

  stages {
    stage('Check for typos') {
      steps {
        sh 'typos --format json | ./typos-checkstyle - > checkstyle.xml || true'
        recordIssues(tools: [checkStyle(id: 'typos', name: 'Typos', pattern: 'checkstyle.xml')], qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]])
      }
    }

    stage('NPM Install') {
      agent {
        docker {
          image 'node:18.15.0'
          reuseNode true
        }
      }
      steps {
        sh('yarn install')
      }
    }

    stage('Build Production') {
      agent {
        docker {
          image 'node:18.15.0'
          reuseNode true
        }
      }
      steps {
        sh('yarn build')
      }
    }

    stage('Check build') {
      agent {
        docker {
          image 'node:18.15.0'
          reuseNode true
        }
      }
      steps {
        sh 'test -e ./plugins/plugin-site/public/index.html || exit 1'
      }
    }

    stage('Lint and Test') {
      environment {
        NODE_ENV = "development"
      }
      agent {
        docker {
          image 'node:18.15.0'
          reuseNode true
        }
      }
      steps {
        sh('yarn lint')
        sh('yarn test')
      }
    }
  }
}
