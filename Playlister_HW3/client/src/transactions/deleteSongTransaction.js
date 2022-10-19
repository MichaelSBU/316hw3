import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * DeleteSong_Transaction
 */
export default class DeleteSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initTitle, initArtist, initYouTubeId, initSongIndex) {
        super();
        this.Store = initStore;
        this.title = initTitle;
        this.artist = initArtist;
        this.youTubeId = initYouTubeId;
        this.songIndex = initSongIndex;
    }

    doTransaction() {
        this.Store.deleteSong(this.songIndex);
    }
    
    undoTransaction() {
        this.Store.addSong(this.title, this.artist, this.youTubeId, this.songIndex);
    }
}