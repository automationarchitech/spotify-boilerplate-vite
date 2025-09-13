const express = require('express')
const dotenv = require('dotenv');
const axios = require('axios');

const port = 3001

dotenv.config()

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET

// Store the access token globally (in production, use a proper session store)
var access_token = '';

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/auth/login', (req, res) => {
  console.log('Auth login endpoint called');

  // Define the scopes we need - properly formatted with spaces
  var scope = "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";

  var state = generateRandomString(16);
  
  console.log('Redirecting to Spotify authorization with state:', state);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: `http://127.0.0.1:${port}/auth/callback`,
    state: state
  })

  const authUrl = 'https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString();
  console.log('Authorization URL:', authUrl);
  
  res.redirect(authUrl);
})


app.get('/auth/callback', async (req, res) => {
  try {
    console.log('Auth callback received. Query parameters:', req.query);
    
    if (!req.query.code) {
      console.error('No code received from Spotify');
      return res.status(400).send('No authorization code received from Spotify');
    }
    
    var code = req.query.code;

    console.log('Exchanging authorization code for access token...');
    
    // Create the request body as URLSearchParams for proper form encoding
    const formData = new URLSearchParams();
    formData.append('code', code);
    formData.append('redirect_uri', `http://127.0.0.1:${port}/auth/callback`);
    formData.append('grant_type', 'authorization_code');

    const response = await axios({
      method: 'post',
      url: 'https://accounts.spotify.com/api/token',
      data: formData,
      headers: {
        'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    // If we get here, the request was successful
    console.log('Successfully received access token from Spotify');
    access_token = response.data.access_token; // Store globally
    var refresh_token = response.data.refresh_token;
    
    // Here you would typically store these tokens and redirect to a page that can use them
    console.log('Access token:', access_token);
    
    // Redirect back to the main application (adjust port as needed)
    res.redirect('http://localhost:5174');
  } catch (error) {
    console.error('Error in auth callback:');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else {
      console.error(error.message);
    }
    res.status(500).send('Authentication failed. See server logs for details.');
  }
})

app.get('/auth/token', (req, res) => {
  res.json(
     {
        access_token: access_token
     })
})

app.listen(port, () => {
  console.log(`Listening at http://127.0.0.1:${port}`)
}).on('error', (err) => {
  if(err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Try another port.`)
  } else {
    console.error('An error occurred starting the server:', err)
  }
})