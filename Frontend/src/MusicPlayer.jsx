import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, FastForward, Rewind, Search, MoreHorizontal } from "lucide-react";
import { Container, Row, Col, Card, InputGroup, FormControl, Button } from "react-bootstrap";

import "./MusicPlayer.scss";
import profile from "/img/Abhi_adobespark.png";
import spotify from "/img/image.png";
import audio1 from "/music/audio1.mp3";
import audio2 from "/music/audio2.mp3";
import audio3 from "/music/audio3.mp3";
import audio4 from "/music/audio4.mp3";
import audio5 from "/music/audio5.mp3";
import audio6 from "/music/audio6.mp3";
import audio7 from "/music/audio7.mp3";
import audio8 from "/music/audio8.mp3";
import song1 from "/img/song1.png";
import song2 from "/img/song2.png";
import song3 from "/img/song3.png";
import song4 from "/img/song4.png";
import song5 from "/img/song5.png";
import song6 from "/img/song6.png";
import song7 from "/img/song7.png";
import song8 from "/img/song8.png";

const dummySongs = [
  { title: "Starboy", artistName: "The Weeknd", duration: "4:16", thumbnail: song1, musicUrl: audio1 },
  { title: "Demons", artistName: "Imagine Dragons", duration: "5:24", thumbnail: song2, musicUrl: audio2 },
  { title: "Mouth of the River", artistName: "Imagine Dragons", duration: "6:23", thumbnail: song3, musicUrl: audio3 },
  { title: "Ghost Stories", artistName: "Coldplay", duration: "3:10", thumbnail: song4, musicUrl: audio4 },
  { title: "Sparks", artistName: "Coldplay", duration: "4:23", thumbnail: song5, musicUrl: audio5 },
  { title: "Viva La Vida", artistName: "Coldplay", duration: "5:32", thumbnail: song6, musicUrl: audio6 },
  { title: "Hymn for the Weekend", artistName: "Coldplay", duration: "2:23", thumbnail: song7, musicUrl: audio7 },
  { title: "Pain", artistName: "Ryan Jones", duration: "3:11", thumbnail: song8, musicUrl: audio8 },
];

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(dummySongs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [search, setSearch] = useState("");
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("For You");
  const [volume, setVolume] = useState(1);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [favourites, setFavourites] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    sessionStorage.setItem("recentlyPlayed", JSON.stringify(recentlyPlayed.slice(0, 10)));
  }, [recentlyPlayed]);

  const handlePlay = (song) => {
    if (song.title === currentSong.title) {
      setIsPlaying(true);
      return;
    }
    setCurrentSong(song);
    setIsPlaying(true);
    setCurrentTime(0);
    setRecentlyPlayed([song, ...recentlyPlayed.filter((s) => s.title !== song.title)]);
  };

  const handleNext = () => {
    const index = dummySongs.findIndex((s) => s.title === currentSong.title);
    if (index < dummySongs.length - 1) handlePlay(dummySongs[index + 1]);
  };

  const handlePrevious = () => {
    const index = dummySongs.findIndex((s) => s.title === currentSong.title);
    if (index > 0) handlePlay(dummySongs[index - 1]);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const toggleFavourite = (song) => {
    const isFavourite = favourites.some((s) => s.title === song.title);
    if (isFavourite) {
      setFavourites(favourites.filter((s) => s.title !== song.title));
    } else {
      setFavourites([...favourites, song]);
    }
    setShowOptions(false);
  };

  const getDisplayedSongs = () => {
    let songs;
    switch (selectedCategory) {
      case "Recently Played":
        songs = recentlyPlayed;
        break;
      case "Favourite":
        songs = favourites;
        break;
      default:
        songs = dummySongs;
    }
    return songs.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
  };

  return (
    <Container fluid className="music-player" style={{ minHeight: "100dvh", width: "100vw", background: `linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,1)), url(${currentSong.thumbnail}) center center / cover no-repeat`,}}>
      <Row>
        <Col lg={2} md={4} sm={12} className="sidebar d-flex flex-row flex-md-column align-items-center align-items-md-start justify-content-center justify-content-md-between">
          <div className="pt-4 ps-3 text-white d-flex flex-column gap-4">
            <img src={spotify} alt="Spotify" style={{ width: 133, height: 40 }} />
            <ul className="list-unstyled d-flex flex-md-column flex-row gap-3">
              {["For You", "Top Tracks", "Favourite", "Recently Played"].map((category) => (
                <li
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    cursor: "pointer",
                    fontWeight: selectedCategory === category ? "600" : "400",
                    color: selectedCategory === category ? "#fff" : "rgba(255,255,255,0.55)",
                    fontSize: "18px"
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
          <div className="ps-3 pb-3">
            <img src={profile} alt="profile" style={{ width: 48, height: 48, borderRadius: 80, objectFit: "cover", background: "#151515", cursor: "pointer" }}/>
          </div>
        </Col>


        <Col lg={4} md={6} sm={12} className="d-flex flex-column">
          <h2 className="text-white mt-4 ms-3">{selectedCategory}</h2>
          <InputGroup className="mb-3 search-bar" style={{ width: "95%", background: '#FFFFFF14', borderRadius: 8, margin: "0 auto" }}>
            <FormControl className="custom-placeholder" placeholder="Search Song, Artist" onChange={(e) => setSearch(e.target.value)} style={{ background: "transparent", color: "white", border: "none", fontSize: 18 }} />
            <InputGroup.Text style={{ background: "transparent", border: "none" }}>
              <Search size={20} color="#FFFFFF" />
            </InputGroup.Text>
          </InputGroup>

          <div className="song-container overflow-auto flex-grow-1" style={{ height: "calc(100vh - 180px)" }}>
            {getDisplayedSongs().map((song, index) => (
              <Card key={index} onClick={() => handlePlay(song)} className="song-card" style={{ background: currentSong.title === song.title ? "#FFFFFF14" : "transparent", color: "#FFFFFF", cursor: "pointer" }}>
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-3">
                    <img src={song.thumbnail} style={{ width: 48, borderRadius: 56 }} alt="thumbnail" />
                    <div>
                      <div style={{ fontSize: 18 }}>{song.title}</div>
                      <div style={{ opacity: 0.6, fontSize: 14 }}>{song.artistName}</div>
                    </div>
                  </div>
                  <div style={{ opacity: 0.6, fontSize: 18 }}>{song.duration}</div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </Col>

        <Col lg={6} md={12} sm={12} className="player-section d-flex flex-column align-items-center justify-content-center pt-4 pb-2 pt-md-5 pb-md-3 pt-lg-5 pb-lg-4">          
        <div className="player-content text-white w-100 d-flex flex-column align-items-center gap-4">
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div className="song-details text-start">
                <h3 className="fw-bold fs-3">{currentSong.title}</h3>
                <p className="opacity-75 fs-5">{currentSong.artistName}</p>
              </div>
              <div className="responsive-album-wrapper">
                <img src={currentSong.thumbnail} alt={currentSong.title} className="responsive-album-img" />
              </div>
              <div>
                <input type="range" min="0" max={duration} value={currentTime} onChange={(e) => {
                  const newTime = Number(e.target.value);
                  audioRef.current.currentTime = newTime;
                  setCurrentTime(newTime);
                }} style={{ width: "100%" }} />
                <div className="d-flex justify-content-between fs-6 opacity-75">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <audio ref={audioRef} src={currentSong.musicUrl} onTimeUpdate={() => setCurrentTime(audioRef.current.currentTime)} onLoadedMetadata={() => setDuration(audioRef.current.duration)} onEnded={handleNext} />

              <div className="d-flex justify-content-between align-items-center w-100 px-3 gap-4">
                <div style={{ position: "relative" }}>
                  <Button variant="link" style={{ background: "rgba(255,255,255,0.1)", borderRadius: "50%" }} className="rounded-circle p-2" onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(!showOptions);
                  }}>
                    <MoreHorizontal size={20} color="#FFFFFF" />
                  </Button>

                  {showOptions && (
                    <div style={{ position: "absolute", top: "-60px", right: 0, background: "#1e1e1e", padding: "8px 12px", borderRadius: "8px", color: "white", zIndex: 100, fontSize: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.5)", cursor: "pointer" }} onClick={() => toggleFavourite(currentSong)}>
                      {favourites.some((s) => s.title === currentSong.title) ? "Remove from Favourite" : "Add to Favourite"}
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-4">
                  <Rewind size={28} fill="white" onClick={handlePrevious} color="white" style={{ cursor: "pointer", opacity: 0.7 }} />
                  <div onClick={() => setIsPlaying(!isPlaying)} style={{ backgroundColor: "#fff", width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    {isPlaying ? <Pause size={28} color="black" fill="black" /> : <Play size={28} color="black" fill="black" />}
                  </div>
                  <FastForward size={28} fill="white" onClick={handleNext} color="white" style={{ cursor: "pointer", opacity: 0.7 }} />
                </div>

                <div style={{ position: "relative" }}>
                  <Button variant="link" className="rounded-circle p-2" style={{ background: "rgba(255,255,255,0.1)", borderRadius: "50%" }} onClick={() => setShowVolumeControl(!showVolumeControl)}>
                    <Volume2 color="white" fill="white" />
                  </Button>
                  {showVolumeControl && (
                    <div style={{ position: "absolute", bottom: "60px", right: 0, background: "#000000aa", padding: 8, borderRadius: 8, width: 120 }}>
                      <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={{ width: "100%" }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}