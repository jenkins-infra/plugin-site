node {
  stage 'Checkout'
  checkout scm
  stage 'Build Docker Image'
  docker.build('jenkinsciinfra/plugin-site')
}
