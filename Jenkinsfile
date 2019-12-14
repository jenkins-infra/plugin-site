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
        DISABLE_SEARCH_ENGINE = "true" // for the test site
      }
      steps {
        sh 'yarn clean'
        sh 'yarn build'
        sh 'test -e public/index.html || exit 1'
      }
    }

    stage('Test') {
      steps {
        sh 'yarn lint'
        sh 'yarn test'
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
        wget -q -O - https://github.com/netlify/netlifyctl/releases/download/v0.3.3/netlifyctl-linux-amd64-0.3.3.tar.gz | tar xvzf - 
        ./netlifyctl -y deploy -b public -A $NETLIFY
        """
      }
    }
  }
}
