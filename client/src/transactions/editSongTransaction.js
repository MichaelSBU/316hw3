import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initStore, initNewTitle, initNewArtist, initNewYouTubeId, initOldTitle, initOldArtist, initOldYouTubeId, initSongIndex) {
        super();
        this.store = initStore;
        this.songIndex = initSongIndex;
        this.newTitle = initNewTitle;
        this.newArtist = initNewArtist;
        this.newYouTubeId = initNewYouTubeId;
        this.oldTitle = initOldTitle;
        this.oldArtist = initOldArtist;
        this.oldYouTubeId = initOldYouTubeId;
    }

    doTransaction() {
        this.store.editSong(this.newTitle, this.newArtist, this.newYouTubeId, this.songIndex);
    }
    
    undoTransaction() {
        this.store.editSong(this.oldTitle, this.oldArtist, this.oldYouTubeId, this.songIndex);
    }
}