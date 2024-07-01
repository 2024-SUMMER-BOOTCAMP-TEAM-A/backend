pipeline {
    agent any
    
    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose-prod.yml'
        // SQLALCHEMY_DATABASE_URL="${env.SQLALCHEMY_DATABASE_URL}"
        // MYSQL_ROOT_PASSWORD="${env.MYSQL_ROOT_PASSWORD}"
        // MYSQL_DATABASE="${env.MYSQL_DATABASE}"
        // MYSQL_USER="${env.MYSQL_USER}"
        // MYSQL_PASSWORD="${env.MYSQL_PASSWORD}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'develop', url: 'https://github.com/2024-SUMMER-BOOTCAMP-TEAM-A/backend.git'
            }
        }

        stage('Test') {
            steps {
                script {
                    sh "docker --version"
                    sh "docker compose --version"
                    sh "echo hello world!"
                }
            }
        }

    //     stage('Build') {
    //         steps {
    //             script {
    //                 sh "docker compose -f ${DOCKER_COMPOSE_FILE} build"
    //             }
    //         }
    //     }

    //     stage('Deploy') {
    //         when {
    //             anyOf {
    //                 branch 'main'
    //                 branch 'master'
    //             }
    //         }
    //         steps {
    //             script {
    //                 sh "docker compose -f ${DOCKER_COMPOSE_FILE} up -d"
    //             }
    //         }
    //     }
    }

    post {
        success {
            echo 'Build and deployment successful!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}