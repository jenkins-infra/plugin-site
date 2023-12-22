pipeline {
  options {
    timeout(time: 60, unit: 'MINUTES')
    ansiColor('xterm')
    disableConcurrentBuilds(abortPrevious: true)
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5')
  }

  agent {
    label 'node'
  }

  triggers {
    cron("${env.BRANCH_IS_PRIMARY ? 'H H/3 * * *' : ''}")
  }

  environment {
    GET_CONTENT = 'true'
    TZ = 'UTC'
    // Amount of available vCPUs, to avoid OOM - https://www.gatsbyjs.com/docs/how-to/performance/resolving-out-of-memory-issues/#try-reducing-the-number-of-cores
    // and 'The command failed for workspaces that are depended upon by other workspaces; can't satisfy the dependency graph' error
    // https://github.com/jenkins-infra/jenkins-infra/tree/production/hieradata/clients/controller.ci.jenkins.io.yaml#L327
    GATSBY_CPU_COUNT = '4'
  }

  stages {
    stage('Check for typos') {
      steps {
        sh 'typos --format json | typos-checkstyle - > checkstyle.xml || true'
        recordIssues(tools: [checkStyle(id: 'typos', name: 'Typos', pattern: 'checkstyle.xml')], qualityGates: [[threshold: 1, type: 'TOTAL', unstable: true]])
      }
    }

    stage('Install dependencies') {
      environment {
        NODE_ENV = 'development'
      }
      steps {
        sh '''
        asdf install
        yarn install
        '''
      }
    }

    stage('Build') {
      environment {
        DISABLE_SEARCH_ENGINE = 'true'
        NODE_ENV = 'development'
      }
      steps {
        sh('yarn build')
      }
    }

    stage('Check build') {
      when { expression { return !fileExists('./plugins/plugin-site/public/index.html') } }
      steps {
        error('Something went wrong, index.html was not generated')
      }
    }

    stage('Lint and Test') {
      environment {
        NODE_ENV = 'development'
        NODE_OPTIONS = '--experimental-vm-modules'
      }
      steps {
        sh '''
        yarn lint
        yarn test
        '''
      }
    }

    stage('Deploy to preview site') {
      when {
        allOf {
          changeRequest()
          // Only deploy from infra.ci.jenkins.io
          expression { infra.isInfra() }
        }
      }
      environment {
        NETLIFY_AUTH_TOKEN = credentials('netlify-auth-token')
      }
      steps {
        sh('netlify-deploy --siteName "jenkins-plugin-site-pr" --title "Preview deploy for ${CHANGE_ID}" --alias "deploy-preview-${CHANGE_ID}" -d ./plugins/plugin-site/public')
      }
      post {
        success {
          recordDeployment('jenkins-infra', 'plugin-site', pullRequest.head, 'success', "https://deploy-preview-${CHANGE_ID}--jenkins-plugin-site-pr.netlify.app")
        }
        failure {
          recordDeployment('jenkins-infra', 'plugin-site', pullRequest.head, 'failure', "https://deploy-preview-${CHANGE_ID}--jenkins-plugin-site-pr.netlify.app")
        }
      }
    }

    stage('Deploy to production') {
      when {
        allOf{
          expression { env.BRANCH_IS_PRIMARY }
          // Only deploy from infra.ci.jenkins.io
          expression { infra.isInfra() }
        }
      }
      environment {
        NODE_ENV = 'production'
        GATSBY_MATOMO_SITE_ID = '1'
        GATSBY_MATOMO_SITE_URL = 'https://jenkins-matomo.do.g4v.dev'
        // TODO: Remove this "custom PATH" once https://github.com/jenkins-infra/docker-builder/blob/e5749f5cf0392549a89ba3a5b41a41fe55ec48dd/Dockerfile#L46 is updated to persist it
        PATH = "/home/jenkins/.local/bin:${env.PATH}"
      }
      steps {
        withCredentials([
          string(credentialsId: 'algolia-plugins-app-id', variable: 'GATSBY_ALGOLIA_APP_ID'),
          string(credentialsId: 'algolia-plugins-search-key', variable: 'GATSBY_ALGOLIA_SEARCH_KEY'),
          string(credentialsId: 'algolia-plugins-write-key', variable: 'GATSBY_ALGOLIA_WRITE_KEY'),
          string(credentialsId: 'PLUGINSITE_STORAGEACCOUNTKEY', variable: 'PLUGINSITE_STORAGEACCOUNTKEY')
        ]) {
          retry(5) {
            sh '''
            yarn build
            blobxfer upload \
            --local-path ./plugins/plugin-site/public \
            --storage-account-key $PLUGINSITE_STORAGEACCOUNTKEY \
            --storage-account prodpluginsite \
            --remote-path pluginsite \
            --recursive \
            --mode file \
            --skip-on-md5-match \
            --file-md5 \
            --connect-timeout 30 \
            --delete
            '''
          }
        }
      }
    }
  }
}
