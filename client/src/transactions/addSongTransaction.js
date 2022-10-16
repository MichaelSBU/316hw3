import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * AddSong_Transaction
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initTitle, initArtist, initYouTubeId, initSongIndex) {
        super();
        this.store = initStore;
        this.title = initTitle;
        this.artist = initArtist;
        this.youTubeId = initYouTubeId;
        this.songIndex = initSongIndex;
    }
    doTransaction() {
        this.store.addSong(this.title, this.artist, this.youTubeId, this.songIndex);
    }
    
    undoTransaction() {
        this.store.deleteSong(this.songIndex);
    }
}