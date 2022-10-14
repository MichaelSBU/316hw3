import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
const EditSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let song = store.currentList === null || store.markedSongId === null ? {title: "", artist: "", youTubeId: ""} : store.currentList.songs[store.markedSongId];

    let newTitle = song.title;
    let newArtist = song.artist;
    let newYouTubeId = song.youTubeId;

    function handleConfirmEditSong(){
        store.editSong(store.markedSongId, newTitle, newArtist, newYouTubeId);
    }

    function handleCancelEditSongModal(){
        store.hideEditSongModal();
    }

    function handleUpdateTitle(event){
        newTitle = event.target.value;
    }

    function handleUpdateArtist(event) {
        newArtist = event.target.value;
    }

    function handleUpdateYouTubeId(event){
        newYouTubeId = event.target.value;
    }

    return (
        <div
        id="edit-song-modal"
        className="modal"
        data-animation="slideInOutLeft">
        <div
            id='edit-song-root'
            className="modal-root">
            <div
                id="edit-song-modal-header"
                className="modal-north">Edit Song</div>
            <div
                id="edit-song-modal-content"
                className="modal-center">
                <div id="title-prompt" className="modal-prompt">Title:</div>
                <input id="edit-song-modal-title-textfield" className='modal-textfield' type="text" defaultValue={song.title} onChange={handleUpdateTitle}/>
                <div id="artist-prompt" className="modal-prompt">Artist:</div>
                <input id="edit-song-modal-artist-textfield" className='modal-textfield' type="text" defaultValue={song.artist} onChange={handleUpdateArtist}/>
                <div id="you-tube-id-prompt" className="modal-prompt">YouTubeId:</div>
                <input id="edit-song-modal-youTubeId-textfield" className='modal-textfield' type="text" defaultValue={song.youTubeId} onChange={handleUpdateYouTubeId}/>
            </div>
            <div className="modal-south">
                <input type="button" id="edit-song-confirm-button" className="modal-button" value='Confirm' onClick={handleConfirmEditSong} />
                <input type="button" id="edit-song-cancel-button" className="modal-button" value='Cancel' onClick={handleCancelEditSongModal} />
            </div>
        </div>
    </div>
    );
}
export default EditSongModal;