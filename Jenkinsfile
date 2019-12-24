pipeline {
  environment {
    SLOW_MODE = "true"
  }
     
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

    stage('Clean') {
      steps {
        sh 'yarn clean'
      }
    }
    
    stage('Build Test') {
      when {
        not {
          environment name: 'JENKINS_URL', value: 'https://trusted.ci.jenkins.io:1443/'
        }
      }
      environment {
        DISABLE_SEARCH_ENGINE = "true" // for the test site
        GATSBY_CONFIG_SITE_METADATA__URL = "https://jenkins-plugins.g4v.dev/"
        GATSBY_CONFIG_SITE_METADATA__SITE_URL = "https://jenkins-plugins.g4v.dev/"
      }
      steps {
        sh 'yarn build'
      }
    }

    stage('Build Production') {
      when {
        not {
          environment name: 'JENKINS_URL', value: 'https://trusted.ci.jenkins.io:1443/'
        }
      }
      steps {
        sh 'yarn build'
      }
    }

    stage('Confirm build') {
      steps {
        sh 'test -e public/index.html || exit 1'
      }
    }

    stage('Test') {
      steps {
        sh 'yarn lint'
        sh 'yarn test'
      }
    }

    stage('Publish Infra Image'){
      when {
        environment name: 'JENKINS_URL', value: 'https://trusted.ci.jenkins.io:1443/'
      }
      steps {
        script {
          infra.withDockerCredentials {
            sh 'docker build -t jenkinsciinfra/plugin-site:dev .'
            sh 'docker push jenkinsciinfra/plugin-site:dev'
          }
        }
      }
    }

    stage('Deploy to netlify') {
      when {
        not {
          environment name: 'JENKINS_URL', value: 'https://trusted.ci.jenkins.io:1443/'
        }
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
