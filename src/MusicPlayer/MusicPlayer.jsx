
import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Card, CardContent, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const MusicPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPlaylist = files
      .filter(file => file.type.startsWith('audio/'))
      .map(file => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        liked: false,
      }));
    setPlaylist(prev => [...prev, ...newPlaylist]);
  };

  const toggleLike = (index) => {
    setPlaylist((prev) =>
      prev.map((song, i) =>
        i === index ? { ...song, liked: !song.liked } : song
      )
    );
  };

  const playSong = (song) => {
    if (currentSong && song.url === currentSong.url) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentSong(song);
      audioRef.current.src = song.url;
      audioRef.current.currentTime = 0; // Reset current time to 0
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSliderChange = (event, newValue) => {
    audioRef.current.currentTime = newValue;
    setCurrentTime(newValue);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 3,
        backgroundImage: 'url("https://t3.ftcdn.net/jpg/05/92/17/70/360_F_592177001_AfRPYr9bO7n64PqP7UjlaDRrXklYYmI3.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Card sx={{ maxWidth: 600, width: '100%', borderRadius: 2, boxShadow: 5, backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
            Playlist Player
          </Typography>

          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              inputProps={{ accept: 'audio/*', multiple: true }}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="upload-button"
            />
            <label htmlFor="upload-button">
              <IconButton variant="contained" color="primary" component="span">
                <UploadFileIcon fontSize="large" /> Add Songs
              </IconButton>
            </label>
          </Box>

          <List>
            {playlist.map((song, index) => (
              <ListItem
                key={index}
                button
                selected={currentSong && song.url === currentSong.url}
                onClick={() => playSong(song)}
                sx={{
                  '&.Mui-selected': { backgroundColor: '#e3f2fd' },
                }}
              >
                <ListItemText primary={song.name} />
                <ListItemSecondaryAction sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song);
                    }}
                  >
                    {currentSong && song.url === currentSong.url ? (
                      isPlaying ? <PauseIcon /> : <PlayArrowIcon />
                    ) : (
                      <PlayArrowIcon />
                    )}
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(index);
                    }}
                  >
                    {song.liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Slider for controlling the playback */}
          {currentSong && (
            <Box sx={{ mt: 2 }}>
              <Slider
                value={currentTime}
                max={duration}
                onChange={handleSliderChange}
                aria-labelledby="continuous-slider"
              />
              <Typography variant="body2" color="textSecondary">
                {Math.floor(currentTime)} / {Math.floor(duration)} seconds
              </Typography>
            </Box>
          )}

          <audio ref={audioRef} />
        </CardContent>
      </Card>
    </Box>
  );
};

export default MusicPlayer;





