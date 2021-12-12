pipeline {
  environment {
    GET_CONTENT = "true"
    NODE_ENV = "production"
    HOME = "${env.WORKSPACE}"
    TZ = "UTC"
  }

  agent {
    dockerfile true
  }

  options {
    timeout(time: 60, unit: 'MINUTES')
    ansiColor('xterm')
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5')
  }

  stages {

    stage('NPM Install') {
      steps {
        sh('npm ci')
      }
    }

    stage('Build Production') {
      steps {
        sh('npm run build')
      }
    }

    stage('Check build') {
      steps {
        sh 'test -e public/index.html || exit 1'
      }
    }

    stage('Lint and Test') {
      steps {
        sh('npm run lint')
        sh('npm run test')
      }
    }
  }
}
