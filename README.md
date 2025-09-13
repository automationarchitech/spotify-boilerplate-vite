# Spotify Web Playback SDK Application

A React-based web application that integrates with the Spotify Web Playback SDK to provide a custom music player interface. Users can authenticate with their Spotify account and control playback directly from the browser.

## Features

- **Spotify Authentication**: Secure OAuth 2.0 login with Spotify
- **Web Playback Control**: Play, pause, skip tracks using Spotify's Web Playback SDK
- **Real-time Track Display**: Shows currently playing track with album artwork
- **Device Management**: Transfer playback between devices
- **Responsive Interface**: Clean, modern UI for music control

## Prerequisites

- Node.js (v14 or higher)
- pnpm package manager
- Spotify Premium account (required for Web Playback SDK)
- Spotify App credentials (Client ID and Client Secret)

## Setup

### 1. Spotify App Configuration

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app or use an existing one
3. Add `http://127.0.0.1:3001/auth/callback` to your app's redirect URIs
4. Note your Client ID and Client Secret

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
SPOTIFY_CLIENT_ID='your_spotify_client_id'
SPOTIFY_CLIENT_SECRET='your_spotify_client_secret'
```

### 3. Install Dependencies

```bash
pnpm install
```

## Running the Application

The application requires both a frontend client and a backend server:

### Start the Backend Server (Terminal 1)
```bash
pnpm run server
```
This starts the Express server on `http://127.0.0.1:3001`

### Start the Frontend Client (Terminal 2)
```bash
pnpm start
```
This starts the Vite development server on `http://localhost:5173`

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Click "Login with Spotify" to authenticate
3. Grant the necessary permissions when prompted
4. Once authenticated, the web player will appear
5. Use your Spotify app to start playing music, or transfer playback to the web player
6. Control playback using the web interface

## Architecture

### Frontend (`src/`)
- **App.jsx**: Main application component with authentication flow
- **Login.jsx**: Spotify login interface
- **WebPlayback.jsx**: Web playback SDK integration and player controls

### Backend (`server/`)
- **index.js**: Express server handling OAuth authentication flow

### Key Technologies
- **React 19**: Frontend framework
- **Vite**: Build tool and development server
- **Express**: Backend server
- **Spotify Web Playback SDK**: Music playback functionality
- **Axios**: HTTP client for API requests

## API Endpoints

- `GET /auth/login` - Initiates Spotify OAuth flow
- `GET /auth/callback` - Handles OAuth callback
- `GET /auth/token` - Returns access token for frontend

## Development Scripts

```bash
# Start frontend development server
pnpm start

# Start backend server
pnpm run server

# Build for production
pnpm run build

# Preview production build
pnpm run serve
```

## Required Spotify Scopes

The application requests the following Spotify scopes:
- `streaming` - Control playback on Web Playback SDK
- `user-read-email` - Read user email
- `user-read-private` - Read user profile
- `user-read-playback-state` - Read current playback state
- `user-modify-playback-state` - Control user's playback

## Troubleshooting

### Common Issues

1. **"Instance not active"**: Ensure you have a Spotify Premium account and try transferring playback using the "Transfer Playback Here" button

2. **Authentication fails**: Check that your redirect URI is correctly configured in your Spotify app settings

3. **Port conflicts**: If port 3001 is in use, the server will display an error. Stop other services or modify the port in `server/index.js`

4. **No music playing**: Start playing music in your Spotify app first, then transfer playback to the web player

## License

This project is for educational purposes. Please ensure you comply with Spotify's terms of service when using their APIs.

## Resources

- [Spotify Web Playback SDK Documentation](https://developer.spotify.com/documentation/web-playback-sdk/)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [React Documentation](https://reactjs.org/)
- [Vite Documentation](https://vitejs.dev/)
