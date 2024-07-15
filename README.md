# Practice Repository

This repository presents a system for the early diagnosis of pneumonia based on chest X-ray images. The system provides a graphical interface that allows you to predict the presence of pneumonia based on image analysis performed by a trained neural network.

This system can be used on any operating system where Docker is installed.

## Contents

- **backend**: Contains backend code in С++.
- **db**: Database related files and scripts.
- **frontend**: Frontend code and resources.
- **ml**: Machine learning models and notebooks.
- **py_backend**: Additional backend code in Python.
- **docker-compose.yml**: Docker Compose file for container orchestration.

## Prerequisites

- Docker
- Docker Compose

## Setup

1. Clone the repository:
```sh
git clone https://github.com/OdincovMD/Practice.git
cd Practice
```
2. Build and run the Docker containers:
```sh
docker-compose up --build
```
3. The application will be available at http://localhost:3000.
4. To stop and remove containers, use the command:
```sh
docker-compose down
```

## Usage
### Backend
+ The backend services are located in the backend and py_backend directories.
### Database
+ Database setup and configurations are in the db directory.
### Frontend
+ The frontend application is located in the frontend directory.
### Machine Learning
+ Machine learning models, weights and train Jupyter notebook are in the ml directory.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request.
