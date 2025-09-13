import React, { useState, useEffect } from 'react';

const track = {
    name: "",
    album: {
        images: [
            { url: "" }
        ]
    },
    artists: [
        { name: "" }
    ]
}

function WebPlayback(props) {

    const [player, setPlayer] = useState(undefined);
    const [is_paused, setPaused] = useState(false);
    const [is_active, setActive] = useState(false);
    const [current_track, setTrack] = useState(track);
    const [device_id, setDeviceId] = useState('');

    useEffect(() => {
        if (!player) return;

        player.addListener('player_state_changed', ( state => {

            if (!state) {
                return;
            }

            setTrack(state.track_window.current_track);
            setPaused(state.paused);

            player.getCurrentState().then( state => { 
                (!state)? setActive(false) : setActive(true) 
            });

        }));

        return () => {
            if (player) {
                player.disconnect();
            }
        };
    }, [player]);


    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });

            setPlayer(player);

            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
                
                // Automatically transfer playback to this device
                transferPlayback(device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
                setDeviceId('');
            });


            player.connect();

        };
    }, [props.token]);

    // Function to transfer playback to this device
    const transferPlayback = async (deviceId) => {
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${props.token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    device_ids: [deviceId],
                    play: false // Don't start playing immediately
                })
            });
            
            if (response.ok) {
                console.log('Playback transferred successfully');
            } else {
                console.error('Failed to transfer playback:', response.status);
            }
        } catch (error) {
            console.error('Error transferring playback:', error);
        }
    };

   return (
    <>
        <div className="container">
            <div className="main-wrapper">
                
                {!is_active ? (
                    <div className="main-wrapper">
                        <b>Instance not active. Transfer your playback using your Spotify app</b>
                        <br/>
                        <p>Device ID: {device_id}</p>
                        <p>Or start playing a song in Spotify to see it here!</p>
                    </div>
                ) : (
                    <>
                        <img src={current_track.album.images[0].url} 
                             className="now-playing__cover" alt="" />

                        <div className="now-playing__side">
                            <div className="now-playing__name">{
                                      current_track.name
                                      }</div>

                            <div className="now-playing__artist">{
                                      current_track.artists[0].name
                                      }</div>
                        </div>
                    </>
                )}
                
                <button className="btn-spotify" onClick={() => { player && player.previousTrack() }} >
                    &lt;&lt;
                </button>

                <button className="btn-spotify" onClick={() => { player && player.togglePlay() }} >
                    { is_paused ? "PLAY" : "PAUSE" }
                </button>

                <button className="btn-spotify" onClick={() => { player && player.nextTrack() }} >
                    &gt;&gt;
                </button>
                
                <button className="btn-spotify" onClick={() => transferPlayback(device_id)} >
                    Transfer Playback Here
                </button>
            </div>
        </div>
     </>
   );
}




export default WebPlayback