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

    stage('NPM Install') {
      agent {
        docker {
          image 'node:14.17'
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
          image 'node:14.17'
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
          image 'node:14.17'
          reuseNode true
        }
      }
      steps {
        sh 'test -e ./plugins/plugin-site/public/index.html || exit 1'
      }
    }

    stage('Lint and Test') {
      agent {
        docker {
          image 'node:14.17'
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
