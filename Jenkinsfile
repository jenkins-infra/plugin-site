pipeline {
  environment {
    GET_CONTENT = "true"
  }

  agent {
    docker {
      image 'node:12'
    }
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
        sh 'yarn install'
      }
    }

    stage('Build Test') {
      when {
        environment name: 'JENKINS_URL', value: 'https://jenkins.gavinmogan.com/'
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
          environment name: 'JENKINS_URL', value: 'https://jenkins.gavinmogan.com/'
        }
      }
      steps {
        sh 'yarn build'
      }
    }

		stage('Check build') {
			steps {
				sh 'test -e public/index.html || exit 1'
      }
    }

		stage('Lint and Test') {
			steps {
				sh 'yarn lint'
        sh 'yarn test'
      }
    }

    stage('Deploy to azure') {
      when {
        environment name: 'JENKINS_URL', value: 'https://trusted.ci.jenkins.io:1443/'
      }
      environment {
        STORAGEACCOUNTKEY = credentials('PLUGINSHTML_STORAGEACCOUNTKEY')
      }
      steps {
        /* -> https://github.com/Azure/blobxfer */
        sh './scripts/blobxfer upload \
          --local-path public \
          --storage-account-key $STORAGEACCOUNTKEY \
          --storage-account pluginshtml \
          --remote-path pluginshtml \
          --recursive \
          --mode file \
          --skip-on-md5-match \
          --file-md5 \
          --connect-timeout 30 \
          --delete'
      }
    }

    stage('Deploy to netlify') {
      when {
        environment name: 'JENKINS_URL', value: 'https://jenkins.gavinmogan.com/'
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
