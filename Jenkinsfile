pipeline {
  options {
    timeout(time: 60, unit: 'MINUTES')
    ansiColor('xterm')
    disableConcurrentBuilds(abortPrevious: true)
    buildDiscarder logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '5', numToKeepStr: '5')
  }

  agent {
    label 'linux-arm64-docker || arm64linux'
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
        npm install --global yarn
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

    stage('Build production') {
      when {
        allOf{
          expression { env.BRANCH_IS_PRIMARY }
          expression { infra.isInfra() }
        }
      }
      environment {
        NODE_ENV = 'production'
        GATSBY_ALGOLIA_APP_ID = credentials('algolia-plugins-app-id')
        GATSBY_ALGOLIA_SEARCH_KEY = credentials('algolia-plugins-search-key')
        GATSBY_ALGOLIA_WRITE_KEY = credentials('algolia-plugins-write-key')
        GATSBY_MATOMO_SITE_ID = '1'
        GATSBY_MATOMO_SITE_URL = 'https://jenkins-matomo.do.g4v.dev'
      }
      steps {
        sh 'yarn build'
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
      steps {
        script {
          infra.withFileShareServicePrincipal([
            servicePrincipalCredentialsId: 'infraci-pluginsjenkinsio-fileshare-service-principal-writer',
            fileShare: 'plugins-jenkins-io',
            fileShareStorageAccount: 'pluginsjenkinsio'
          ]) {
            sh '''
            # Don't output sensitive information
            set +x

            # Synchronize the File Share content
            azcopy sync \
              --skip-version-check \
              --recursive=true\
              --delete-destination=true \
              --compare-hash=MD5 \
              --put-md5 \
              --local-hash-storage-mode=HiddenFiles \
              ./plugins/plugin-site/public/ "${FILESHARE_SIGNED_URL}"
            '''
          }
        }
      }
      post {
        failure {
          // Retrieve azcopy logs and archive them when deployment fails
          sh '''
          cat /home/jenkins/.azcopy/*.log > azcopy.log
          '''
          archiveArtifacts 'azcopy.log'
        }
      }
    }
  }
}
