pipeline {
  environment {
    GET_CONTENT = "true"
    NODE_ENV = "production"
  }

  agent {
    label 'docker&&linux'
  }

  triggers {
    cron('H H/3 * * *')
  }

  options {
    timeout(time: 60, unit: 'MINUTES')
    ansiColor('xterm')
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5')
  }

  stages {

    stage('Yarn Install') {
      steps {
        runDockerCommand('node:13',  'yarn install')
      }
    }

    stage('Build Production') {
      steps {
        runDockerCommand('node:13',  'yarn build')
      }
    }

    stage('Check build') {
      steps {
        sh 'test -e public/index.html || exit 1'
      }
    }

    stage('Lint and Test') {
      steps {
        runDockerCommand('node:13',  'yarn lint')
        runDockerCommand('node:13',  'yarn test')
      }
    }

    stage('Deploy to azure') {
      when { expression { return infra.isTrusted() } }
      environment {
        PLUGINSITE_STORAGEACCOUNTKEY = credentials('PLUGINSITE_STORAGEACCOUNTKEY')
      }
      steps {
        runDockerCommand("mcr.microsoft.com/blobxfer:1.9.1", 'upload \
          --local-path public \
          --storage-account-key $PLUGINSITE_STORAGEACCOUNTKEY \
          --storage-account prodpluginsite \
          --remote-path pluginsite \
          --recursive \
          --mode file \
          --skip-on-md5-match \
          --file-md5 \
          --connect-timeout 30 \
          --delete \
          --verbose')
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
      -v "\$PWD:\$PWD" \
      -u \$(id -u):\$(id -g) \
      $image \
      $cmd
  """
}
