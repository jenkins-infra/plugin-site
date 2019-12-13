pipeline {
  agent {
    docker {
      image 'node:12'
    }
  }

  options {
    timeout(time: 60, unit: 'MINUTES')
    ansiColor('xterm')
  }

  stages {
    stage('Install') {
      steps {
        sh 'yarn install'
      }
    }

    stage('Build') {
      environment {
        SLOW_MODE = "true"
      }
      steps {
        sh 'yarn clean'
        sh 'yarn build'
        sh 'test -e public/index.html || exit 1'
      }
    }

    stage('Deploy') {
      when {
        // branch 'master'
        branch 'gatsby'
      }
      environment {
        NETLIFY = credentials('netlify-gavinmogan')
      }
      steps {
        sh """
        wget -q -O - https://github.com/netlify/netlifyctl/releases/download/v0.4.0/netlifyctl-linux-amd64-0.4.0.tar.gz | tar xvzf -
        ./netlifyctl -y deploy -b public -A $NETLIFY
        """
      }
    }
  }
}
