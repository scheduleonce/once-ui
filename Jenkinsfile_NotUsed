def testReports = false
//stage 'Build'
node('once-ui-pod') {
    try {
        def branchName = env.CHANGE_TARGET
        if (branchName == null) {
            branchName = env.BRANCH_NAME
        }
        def parseChannelAndEnv = getEnvironment(branchName)
        def environment = parseChannelAndEnv[0]
      container('once-ui'){
        stage('Checkout') {
            checkout scm
        }
      }
      container('once-ui'){
        stage('Test') {
            env.NODE_ENV = "test"
                sh "npm ci"
                sh "npm run prettier"
                sh "npm run lint"
                sh "npm run test"
                testReports = true
        }
      }
      container('once-ui'){
        stage('Docker Image Build') {
          println environment
          def registry_url = "http://dockeronce.azurecr.io/" // Docker Hub
          def docker_creds_id = "dockeronce" // name of the Jenkins Credentials ID
          if( environment!= null ) {
            docker.withRegistry("${registry_url}", "${docker_creds_id}") {
              echo "Building docker image with docker.build(once-ui:qa)"
              image = docker.build("once-ui:qa")
              stage("Docker Image Push") {
                image.push()
              }
            }
          }
        }
      }
    } catch (e) {
        currentBuild.result = "FAILED"
        throw e
    } finally {
        if(testReports){
            junit 'reports/**/*.xml'
        }
        notifyBuild(currentBuild.result, env.channel)
        cleanWs()
    }
}

def getEnvironment(String branchName) {
    def environment
    def isTeamBranch = (branchName ==~ /team\/.*/)
    if (isTeamBranch) {
        environment = branchName.replace("team/", "")
        return [environment, "$environment-builds"]
    } else if (branchName == "master") {
        return ["prod", "jenkins"]
    } else if (branchName == "qa") {
        return ["qa", "jenkins"]
    } else {
        return [null];
    }
}

def notifyBuild(String buildStatus = 'STARTED', String channel = "jenkins") {
    // build status of null means successful
    buildStatus = buildStatus ?: 'SUCCESSFUL'

    // Default values
    def colorName = 'RED'
    def colorCode = '#FF0000'
    def subject = "${env.JOB_NAME} [${env.BUILD_NUMBER}]"
    def summary = "${buildStatus}: Job <${env.BUILD_URL}|${subject}>"
    def details = """<p>STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
    <p> Check console output at & QUOT; < a href = '${env.BUILD_URL}'>${env.JOB_NAME}[${env.BUILD_NUMBER}]</a>&QUOT;</p >"""

    // Override default values based on build status
    if (buildStatus == 'STARTED' || buildStatus == 'UNSTABLE') {
        color = 'YELLOW'
        colorCode = '#FFFF00'
    } else if (buildStatus == 'SUCCESSFUL' || buildStatus == 'Success' || buildStatus == 'SUCCESS') {
        color = 'GREEN'
        colorCode = '#00FF00'
    } else {
        color = 'RED'
        colorCode = '#FF0000'
    }
    // Send notifications
    slackSend(channel: "#$channel", color: colorCode, message: summary)
}
