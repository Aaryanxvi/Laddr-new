pipeline {
    agent any

    // Started by the GitHub webhook (repo Settings -> Webhooks -> /github-webhook/)
    triggers {
        githubPush()
    }

    environment {
        CI = 'false'   // react-scripts would otherwise fail the build on lint warnings
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Build') {
            steps {
                echo 'Installing dependencies and building the React frontend...'
                dir('backend') {
                    bat 'npm ci --no-audit --no-fund'
                }
                dir('frontend') {
                    bat 'npm ci --no-audit --no-fund'
                    bat 'npm run build'
                }
                archiveArtifacts artifacts: 'frontend/build/**', fingerprint: true
            }
        }

        stage('Test') {
            steps {
                echo 'Checking backend syntax and running unit tests...'
                dir('backend') {
                    bat 'for %%f in (server.js routes\\*.js utils\\*.js middleware\\*.js models\\*.js config\\*.js) do node --check %%f || exit /b 1'
                    bat 'node --test "tests/*.test.js"'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying frontend build...'
                bat 'if exist "%JENKINS_HOME%\\..\\deploy\\laddr-new" rmdir /s /q "%JENKINS_HOME%\\..\\deploy\\laddr-new"'
                bat 'xcopy /E /I /Q frontend\\build "%JENKINS_HOME%\\..\\deploy\\laddr-new"'
                bat 'dir "%JENKINS_HOME%\\..\\deploy\\laddr-new"'
            }
        }
    }

    post {
        success {
            echo "Laddr-new pipeline succeeded for commit ${env.GIT_COMMIT}"
        }
        failure {
            echo 'Pipeline failed. Check the stage logs above.'
        }
    }
}
