pipeline {
    agent any
    
    environment {
        repository = "jungeunyoon/teama"  //docker hub id와 repository 이름
        DOCKERHUB_CREDENTIALS = credentials('team-a-docker-hub') // jenkins에 등록해 놓은 docker hub credentials 이름
        dockerImage = 'node-backend' 
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'develop', url: "https://github.com/2024-SUMMER-BOOTCAMP-TEAM-A/backend.git"
            }
        }

        stage('Test') {
            steps {
                script {
                    sh "docker --version"
                    sh "docker compose --version"
                }
            }
        }
        stage('Building our image') { 
            steps { 
                script { 
                    sh "docker build -t ${repository}/$dockerImage:${BUILD_NUMBER} ." // docker build

                }
            } 
        }
        stage('Login'){
            steps{
                sh "echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin" // docker hub 로그인
            }
        }
        stage('Deploy our image') { 
            steps { 
                script {
                    sh "docker push ${repository}/$dockerImage:${BUILD_NUMBER}"//docker push
                } 
            }
        } 
        stage('Cleaning up') { 
            steps { 
                sh "docker rmi ${repository}/$dockerImage:${BUILD_NUMBER}" // docker image 제거
            }
        } 
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