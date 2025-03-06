# TravelLah Backend

This is the backend of the TravelLah application, built using Spring Boot and MongoDB. The backend provides endpoints to receive and retrieve messages.

## Prerequisites

- Java 11 or higher
- MongoDB
- Apache Maven

### Installing Apache Maven

1. Download Apache Maven from the [official website](https://maven.apache.org/download.cgi).![image](https://github.com/user-attachments/assets/86b01608-d45a-4c9d-b990-558cff84ac04)

2. Extract the downloaded archive to a directory of your choice.
3. Add the `bin` directory of the extracted Maven folder to your system's `PATH` environment variable:
   - Copy the path to the `bin` folder of your Apache Maven installation.
   - Search for "Environment Variables" in your system settings.
   - Edit the `PATH` variable and add the copied path to the list.

### Verify Maven Installation

Open a terminal and run the following command to verify that Maven is installed correctly:
```sh
mvn -version
```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Tingfeng03/TravelLah.git
   cd TravelLah/backend
   ```

2. Install dependencies and build the project:
   ```sh
   mvn clean install
   ```

## Running the Application

1. Ensure that MongoDB is running on your local machine or update the MongoDB connection settings in `application.properties`.

2. Start the Spring Boot application:
   ```sh
   mvn spring-boot:run
   ```

## Endpoints

### POST /api/messages

Receives a message from the frontend and saves it to the database.

- **URL**: `/api/messages`
- **Method**: `POST`
- **Request Body**: JSON object with a `content` field
- **Response**: 
  - `200 OK` with a success message if the message is saved successfully
  - `400 Bad Request` if the `content` field is missing or empty

### GET /api/messages

Retrieves all messages from the database.

- **URL**: `/api/messages`
- **Method**: `GET`
- **Response**: `200 OK` with a list of messages

## Code Overview

### `MessageController.java`

Handles incoming HTTP requests for messages. It includes the following endpoints:
- `POST /api/messages`: Receives and saves a message.
- `GET /api/messages`: Retrieves all messages.

### `MessageRepository.java`

A MongoDB repository interface for the `Message` entity.

### `Message.java`

A model class representing a message. It includes fields for `id` and `content`, along with getters and setters.

### `demoApplication.java`

The main class for the Spring Boot application. It contains the `main` method to run the application.

## Troubleshooting

- **Database Connection Issues**: Ensure that MongoDB is running and accessible. Check the connection settings in `application.properties`.
- **CORS Issues**: The backend is configured to allow requests from any origin using the `@CrossOrigin(origins = "*")` annotation.

