pipeline {
  environment {
    GET_CONTENT = "true"
    NODE_ENV = "production"
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
      steps {
        runDockerCommand('node:14',  'npm ci')
      }
    }

    stage('Build Production') {
      steps {
        runDockerCommand('node:14',  'npm run build')
      }
    }

    stage('Check build') {
      steps {
        sh 'test -e public/index.html || exit 1'
      }
    }

    stage('Lint and Test') {
      steps {
        runDockerCommand('node:14',  'npm run lint')
        runDockerCommand('node:14',  'npm run test')
      }
    }
  }
}

def runDockerCommand(image, cmd) {
  sh """
    docker run \
      --network host \
      --rm -e GET_CONTENT \
      -w "\$PWD" \
      -e HOME="\$PWD" \
      -v "\$PWD:\$PWD" \
      -u \$(id -u):\$(id -g) \
      $image \
      $cmd
  """
}
