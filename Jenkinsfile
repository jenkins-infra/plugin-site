pipeline {
  environment {
    GET_CONTENT = "true"
    NODE_ENV = "production"
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
      steps {
        runDockerCommand('node:14.17',  'yarn install')
      }
    }

    stage('Build Production') {
      steps {
        runDockerCommand('node:14.17',  'yarn build')
      }
    }

    stage('Check build') {
      steps {
        sh 'test -e ./plugins/plugin-site/public/index.html || exit 1'
      }
    }

    stage('Lint and Test') {
      steps {
        runDockerCommand('node:14.17',  'yarn lint')
        runDockerCommand('node:14.17',  'yarn test')
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
