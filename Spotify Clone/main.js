let currentSong = new Audio();
let songs;

// adding event listener to handburger

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".left").style.position = "fixed";
    document.querySelector(".up").style.zIndex = "0";
    document.querySelector(".up").style.position = "absolute";

});

document.querySelector(".cancel").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-110%";
    document.querySelector(".left").style.position = "absolute";
    document.querySelector(".up").style.zIndex = "1";
    document.querySelector(".up").style.position = "fixed";
});



// add event listener to previous and next

document.querySelector(".svg2").addEventListener("click", () => {
    let currentSongIndex = songs.indexOf(currentSong.src);
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    currentSong.src = songs[currentSongIndex];
    currentSong.play()

    let playIcon = document.querySelector(".svg3");
    playIcon.querySelector("img").src = "/pause.svg";

    let thumbnails = document.querySelectorAll(".music");
    document.querySelector(".playingimg").querySelector("img").src = thumbnails[currentSongIndex].querySelector("img").src;
    document.querySelector(".playingtitle").innerText = thumbnails[currentSongIndex].querySelector(".head").innerText;
    document.querySelector(".playingpara").innerText = thumbnails[currentSongIndex].querySelector(".para").innerText;

    seekBar();
})

document.querySelector(".svg4").addEventListener("click", () => {
    let currentSongIndex = songs.indexOf(currentSong.src);
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    currentSong.src = songs[currentSongIndex];
    currentSong.play()

    let playIcon = document.querySelector(".svg3");
    playIcon.querySelector("img").src = "/pause.svg";

    let thumbnails = document.querySelectorAll(".music");
    document.querySelector(".playingimg").querySelector("img").src = thumbnails[currentSongIndex].querySelector("img").src;
    document.querySelector(".playingtitle").innerText = thumbnails[currentSongIndex].querySelector(".head").innerText;
    document.querySelector(".playingpara").innerText = thumbnails[currentSongIndex].querySelector(".para").innerText;

    seekBar();
})



async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/");
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href)
        }
    }
    return songs;
}


const getPlaylistList = async () => {

    let playlists = ["Playlist1", "Playlist2", "Playlist3", "Playlist4", "Playlist5"];
    let playlistList = [];
    let i = 0;
    for (let playlist of playlists) {
        let b = await fetch(`http://127.0.0.1:5500/playlists/${playlist}/`);
        let response = await b.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let as = div.getElementsByTagName("a");
        let songs = []
        for (let i = 0; i < as.length; i++) {
            const element = as[i];
            if (element.href.endsWith(".mp3")) {
                songs.push(element.href)
            }
        }
        playlistList[i] = songs;
        i++;
    }

    return playlistList;
}


const playPlaylist = (currentPlaylist, currentIndex) => {

    const playNextSong = () => {
        currentSong.src = currentPlaylist[currentIndex];
        currentSong.play();
        currentIndex = (currentIndex + 1) % currentPlaylist.length;
    };

    currentSong.addEventListener('ended', () => {
        playNextSong();
        let playIcon = document.querySelector(".svg3");
        playIcon.querySelector("img").src = "/pause.svg";
    });

    playNextSong();

}



const main2 = async () => {
    let playlistList = await getPlaylistList();
    let playlistsThumbnails = document.querySelectorAll(".playlist");

    for (let i = 0; i < playlistsThumbnails.length; i++) {
        playlistsThumbnails[i].addEventListener("click", () => {
            const currentPlaylist = playlistList[i];
            playPlaylist(currentPlaylist, 0);

            const library = document.querySelector(".library");
            library.innerHTML = '<h3>Current Playlist<h3>';

            let songDiv = document.createElement("div");
            songDiv.classList.add("song");
            currentPlaylist.forEach(song => {
                let text = (song.split("/").slice(-1)[0].replaceAll("%20", " ").split(" - "));
                let songTitle = text[0];
                let songDesc = text[1].replace(".mp3", "");

                // Create a random SVG thumbnail
                let thumbnailSVG = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="30px" height="30px" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-music">
                        <path d="M9 18V5l12-2v13"></path>
                        <circle cx="6" cy="18" r="3"></circle>
                        <circle cx="18" cy="16" r="3"></circle>
                    </svg>
                `;

                // Create a div for song title and description
                let titleDescDiv = document.createElement("div");
                titleDescDiv.classList.add(`title-desc`);
                titleDescDiv.innerHTML = `
                    <h5>${songTitle}</h5>
                    <p>${songDesc}</p>
                `;

                // Create a div to hold thumbnail and play/pause icon
                let songContentDiv = document.createElement("div");
                songContentDiv.classList.add(`song-content`);
                songContentDiv.innerHTML = `<div class="thumbnail">${thumbnailSVG}</div>` + titleDescDiv.innerHTML;


                // Create a new div element for each song
                songDiv.appendChild(songContentDiv);

                // Append the songDiv to the .library element
                library.appendChild(songDiv);
            });
            let currentIndex = 0; // Variable to keep track of the current index in the playlist

            document.querySelector(".svg2").addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + currentPlaylist.length) % currentPlaylist.length;
                currentSong.src = currentPlaylist[currentIndex];
                currentSong.play();
            });
            
            document.querySelector(".svg4").addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % currentPlaylist.length;
                currentSong.src = currentPlaylist[currentIndex];
                currentSong.play();
            });
        });
    }
};









main2()







const playMusic = (songs, pause = false) => {

    let thumbnails = document.querySelectorAll(".music");

    for (let i = 0; i < thumbnails.length; i++) {

        thumbnails[i].addEventListener("click", () => {
            currentSong.src = songs[i];
            if (!pause) {
                currentSong.play();
            }
        })
    }

}


const playSong = async (songs, pause = false, i) => {
    currentSong.src = songs;
    if (!pause) {
        currentSong.play();
    }

    let thumbnails = document.querySelectorAll(".music");
    document.querySelector(".playingimg").querySelector("img").src = await thumbnails[i].querySelector("img").src;
    document.querySelector(".playingtitle").innerText = await thumbnails[i].querySelector(".head").innerText;
    document.querySelector(".playingpara").innerText = await thumbnails[i].querySelector(".para").innerText;

    seekBar();
}


const updating = () => {
    let thumbnails = document.querySelectorAll(".music");
    for (let i = 0; i < thumbnails.length; i++) {

        thumbnails[i].addEventListener("click", () => {

            let playIcon = document.querySelector(".svg3");
            playIcon.querySelector("img").src = "/pause.svg";

            let src = thumbnails[i].querySelector("img").src;
            let titl = thumbnails[i].querySelector(".head").innerText;
            let parag = thumbnails[i].querySelector(".para").innerText;

            document.querySelector(".playingimg").querySelector("img").src = src;
            document.querySelector(".playingtitle").innerText = titl;
            document.querySelector(".playingpara").innerText = parag;

            seekBar();
        })
    }
}


const seekBar = () => {
    const currrentProgress = document.querySelector(".currrentprogress");

    currentSong.addEventListener("timeupdate", () => {
        const currentTime = currentSong.currentTime;
        const duration = currentSong.duration;
        const progress = (currentTime / duration) * 100;

        currrentProgress.style.width = progress + "%";

        document.querySelector(".starttime").innerText = timeConverter(currentSong.currentTime);
        document.querySelector(".endtime").innerText = timeConverter(currentSong.duration);

    });
}


// Adding an event listener to seekbar

const progressBar = document.querySelector(".progressbar");
const currrentProgress = document.querySelector(".currrentprogress");

progressBar.addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    currrentProgress.style.width = percent + "%";
    currentSong.currentTime = (percent * currentSong.duration) / 100;
    currentSong.play();
    let playIcon = document.querySelector(".svg3");
    playIcon.querySelector("img").src = "/pause.svg";
})

const changeName = (songs) => {

    for (let i = 0; i < songs.length; i++) {

        let href = songs[i];
        let headings = href.split("/songs/")[1];
        let heading = headings.replaceAll("%20", " ");
        let finalHeading = heading.split(" - ");

        let titles = document.querySelectorAll(".head");
        titles[i].innerText = finalHeading[0];
        let paras = document.querySelectorAll(".para");
        paras[i].innerText = finalHeading[1].replace(".mp3", "");

    }
}



function timeConverter(seconds) {


    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);

    // Add leading zero if remainingSeconds or minuter are less than 10
    remainingSeconds = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return minutes + ":" + remainingSeconds;

}


const playPauseIcon = () => {
    let playIcon = document.querySelector(".svg3");
    playIcon.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playIcon.querySelector("img").src = "/pause.svg";

        } else {
            currentSong.pause();
            playIcon.querySelector("img").src = "/play.svg"
        }
    })
}



let sound = document.querySelector(".svg9").querySelector("img");
currentSong.muted = false;
sound.addEventListener("click", () => {
    if (currentSong.muted == false) {
        currentSong.muted = true;
        sound.src = "/mute.svg";
    } else {
        currentSong.muted = false
        sound.src = "/unmute.svg";
    }
});


const volumeSlider = document.querySelector('.volumebar input[type="range"]');

volumeSlider.addEventListener('input', () => {
    const volume = volumeSlider.value / 100;
    currentSong.volume = volume;
});



currentSong.addEventListener("ended", () => {
    let playIcon = document.querySelector(".svg3");
    playIcon.querySelector("img").src = "/play.svg";
})






async function main() {

    //get list of songs 
    songs = await getSongs();
    playSong(songs[0], true, 0);


    //change name
    changeName(songs);

    //play music 
    playMusic(songs);

    //updating
    updating();

    //play-pause icon
    playPauseIcon();
}

main();
