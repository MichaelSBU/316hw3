import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    let canAddSong = true, canUndo = true, canRedo = true, canClose = true;

    if(store.currentList === null || store.modalOpen){
        canAddSong = false;
        canUndo = false;
        canRedo = false;
        canClose = false;
    } 
    if(!store.canUndo()){
        canUndo = false;
    }
    if(!store.canRedo()){
        canRedo = false;
    }

    let addSongButton = canAddSong ? "playlister-button" : "playlister-button-disabled";
    let undoButton = canUndo ? "playlister-button" : "playlister-button-disabled";
    let redoButton = canRedo ? "playlister-button" : "playlister-button-disabled";
    let closePlaylistButton = canClose ? "playlister-button" : "playlister-button-disabled";



    function handleAddSong(){
        if(store.currentList !== null){
            store.addCreateSongTransaction(store.currentList.songs.length, "Untitled", "Unknown", "dQw4w9WgXcQ");
        }
    }

    function handleUndo() {
        store.undo();
    }
    function handleRedo() {
        store.redo();
    }
    function handleClose() {
        history.push("/");
        store.closeCurrentList();
    }
    let editStatus = false;
    if (store.isListNameEditActive) {
        editStatus = true;
    }
    return (
        <span id="edit-toolbar">
            <input
                type="button"
                id='add-song-button'
                disabled={editStatus}
                value="+"
                className={addSongButton}
                onClick={handleAddSong}
            />
            <input
                type="button"
                id='undo-button'
                disabled={editStatus}
                value="⟲"
                className={undoButton}
                onClick={handleUndo}
            />
            <input
                type="button"
                id='redo-button'
                disabled={editStatus}
                value="⟳"
                className={redoButton}
                onClick={handleRedo}
            />
            <input
                type="button"
                id='close-button'
                disabled={editStatus}
                value="&#x2715;"
                className={closePlaylistButton}
                onClick={handleClose}
            />
        </span>);
}

export default EditToolbar;