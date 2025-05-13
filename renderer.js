let currentIndex = 0;
let songs = [];

const audio = document.getElementById('audio');
const currentSong = document.getElementById('current-song');
const playlist = document.getElementById('playlist');
const progress = document.getElementById('progress');

document.getElementById('load').addEventListener('click', async () => {
  songs = await window.electronAPI.selectFolder();
  if (songs.length > 0) {
    currentIndex = 0;
    renderPlaylist();
    playSong();
  }
});

document.getElementById('play').addEventListener('click', () => {
  if (audio.src) {
    if (audio.paused) audio.play();
    else audio.pause();
  }
});

document.getElementById('next').addEventListener('click', () => {
  if (songs.length > 0) {
    currentIndex = (currentIndex + 1) % songs.length;
    playSong();
  }
});

document.getElementById('prev').addEventListener('click', () => {
  if (songs.length > 0) {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    playSong();
  }
});

audio.addEventListener('timeupdate', () => {
  progress.value = (audio.currentTime / audio.duration) * 100;
});

audio.addEventListener('ended', () => {
  document.getElementById('next').click();
});

function playSong() {
  audio.src = songs[currentIndex];
  audio.play();

  const filePath = songs[currentIndex];
  let name;
  if (filePath.includes('\\')) {
    console.log('Windows path detected');
    name = filePath.split('\\').pop();
  } else {
    name = filePath.split('/').pop();
  }

  currentSong.textContent = `🎶 ${name}`;
  updateActiveSong();
}

function renderPlaylist() {
  playlist.innerHTML = '';
  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.textContent = song.includes('\\') ? song.split('\\').pop() : song.split('/').pop();
    li.addEventListener('click', () => {
      currentIndex = index;
      playSong();
    });
    playlist.appendChild(li);
  });
  updateActiveSong();
}

function updateActiveSong() {
  const items = playlist.querySelectorAll('li');
  items.forEach((item, index) => {
    item.classList.toggle('active', index === currentIndex);
  });
}
