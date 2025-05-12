# Telemedicine Portal
## Overview
A comprehensive healthcare portal, enabling remote medical consultations and real-time communication.

## Features
- Video consultations using WebRTC
- Real-time chat functionality
- Appointment scheduling
- Medical records management
- Secure authentication

## Technology Stack
### Frontend
- React.js
- WebRTC
- Socket.io-client

### Backend
- Node.js
- Express.js
- MongoDB
- Socket.io
- JWT Authentication

### DevOps
- Docker
- Docker Compose

## Architecture
- WebRTC for peer-to-peer video streaming
- Socket.io as signaling server for WebRTC and chat rooms
- MongoDB for storing user data and medical records
- RESTful API for data management
- Containerized deployment using Docker

## Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Start containers: `docker-compose up`
4. Access portal: `http://localhost:5173`


