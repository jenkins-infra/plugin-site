pipeline {
  environment {
    GET_CONTENT = "true"
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
        sh """
          docker build \
            --build-arg DISABLE_SEARCH_ENGINE \
            --build-arg GET_CONTENT \
            --build-arg GATSBY_CONFIG_SITE_METADATA__URL \
            --build-arg GATSBY_CONFIG_SITE_METADATA__SITE_URL \
            -t ${imageName()}:${imageTag()} .
        """
      }
    }
    stage('Docker Push Test') {
      when {
        environment name: 'JENKINS_URL', value: 'https://jenkins.gavinmogan.com/'
      }
      environment {
        DOCKER = credentials("dockerhub-halkeye")
      }
      steps {
        sh """
          docker login --username=\"$DOCKER_USR\" --password=\"$DOCKER_PSW\"
          docker push ${imageName()}:${imageTag()}
        """
      }
    }

    stage('Build Production') {
      when {
        environment name: 'JENKINS_URL', value: 'https://trusted.ci.jenkins.io:1443/'
      }
      steps {
        sh """
          docker build \
            --build-arg DISABLE_SEARCH_ENGINE \
            --build-arg GET_CONTENT \
            --build-arg GATSBY_CONFIG_SITE_METADATA__URL \
            --build-arg GATSBY_CONFIG_SITE_METADATA__SITE_URL \
            -t ${imageName()}:${imageTag()} .
        """
        script {
          infra.withDockerCredentials {
            sh "docker push ${imageName()}:${imageTag()}'"
          }
        }
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
          rm -rf public
          mkdir -p public
          docker run --rm ${imageName()}:${imageTag()} tar -cf - /pub | tar -C public --strip-components=1 -xf -
          wget -q -O - https://github.com/netlify/netlifyctl/releases/download/v0.3.3/netlifyctl-linux-amd64-0.3.3.tar.gz | tar xvzf - 
          ./netlifyctl -y deploy -b public -A $NETLIFY
        """
      }
    }
  }
}

def imageName() {
  if (JENKINS_URL == "https://jenkins.gavinmogan.com/") {
    return "halkeye/jenkins-plugin-site"
  } else {
    return "jenkinsinfra/plugin-site"
  }
}

def imageTag() {
  if (!env.GIT_COMMIT) {
    env.GIT_COMMIT = sh(returnStdout: true, script: "git log --pretty=format:'%h' -n 1").trim();
  }
  return "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(6)}"
}
