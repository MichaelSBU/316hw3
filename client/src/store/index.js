import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
import AddSong_Transaction from '../transactions/addSongTransaction.js'
import MoveSong_Transaction from '../transactions/moveSongTransaction.js';
import DeleteSong_Transaction from '../transactions/deleteSongTransaction.js';
import EditSong_Transaction from '../transactions/editSongTransaction.js';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG: "MARK_SONG",
    CLOSE_MODAL: "CLOSE_MODAL"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        listNameActive: false,
        markedListId: null,
        markedSongId: null,
        modalOpen: false
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId,
                    modalOpen: store.modalOpen
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    listNameActive: false,
                    markedListId: null,
                    markedSongId: null,
                    modalOpen: false
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId,
                    modalOpen: store.modalOpen
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId,
                    modalOpen: store.modalOpen
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    listNameActive: false,
                    markedListId: payload.id,
                    markedSongId: store.markedSongId,
                    modalOpen: false
                });
            }
            // PREPARE TO Delete/Edit A songs
            case GlobalStoreActionType.MARK_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: payload.id,
                    modalOpen: true
                });
            }

            //CLOSE MODAL
            case GlobalStoreActionType.CLOSE_MODAL: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId,
                    modalOpen: false
                });
            }

            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload.list,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId,
                    modalOpen: false
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    listNameActive: true,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId,
                    modalOpen: store.modalOpen
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.


    store.createNewList = function(){
        async function asyncCreateNewList(){
            let response = await api.createPlaylist(store.idNamePairs.length);
            if(response.data.success){
                let playlist = response.data.playlist;
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
                });
                store.history.push("/playlist/" + playlist._id);
            }
        }
        asyncCreateNewList();
    }

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylist(playlist._id, playlist.name, playlist.songs);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                                store.history.push("/playlist/" + playlist._id);
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        tps.clearAllTransactions();
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: {list: playlist}
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }

     // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
     store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
        let transaction = new AddSong_Transaction(store, title, artist, youTubeId, index);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A MoveSong_Transaction TO THE TRANSACTION STACK
    store.addMoveSongTransaction = (start, end) => {
        let transaction = new MoveSong_Transaction(store, start, end);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
    store.addDeleteSongTransaction = (index) => {
        let song = store.currentList.songs[index];
        let transaction = new DeleteSong_Transaction(store, song.title, song.artist, song.youTubeId, index);
        tps.addTransaction(transaction);
    }
    // THIS FUNCTION ADDS AN UpdateSong_Transaction TO THE TRANSACTION STACK
    store.addEditSongTransaction = (index, newTitle, newArtist, newYouTubeId) => {
        // GET THE CURRENT TEXT
        let song = store.currentList.songs[index];
        let transaction = new EditSong_Transaction(store, newTitle, newArtist, newYouTubeId, song.title, song.artist, song.youTubeId, index);
        tps.addTransaction(transaction);
    }

    store.undo = function () {
        if(tps.hasTransactionToUndo){
            tps.undoTransaction();
        }
    }
    store.redo = function () {
        if(tps.hasTransactionToRedo){
            tps.doTransaction();
        }
    }

    store.canUndo = function (){
        return tps.hasTransactionToUndo();
    }

    store.canRedo = function (){
        return tps.hasTransactionToRedo();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setIsListNameEditActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    } 


    //FUNCTIONS INVOLVED IN DELETING PLAYLIST
    store.deletePlaylist = function (id) {
        async function asyncDeletePlaylist(id){
            let response = await api.deletePlaylist(id);
            if(response.data.success){
                store.loadIdNamePairs();
            }
        }
        asyncDeletePlaylist(id);
        store.hideDeleteListModal();
        store.loadIdNamePairs();
    }

    store.showDeleteListModal = function (nameIdPair) {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload:{id: nameIdPair}
        });
    }

    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.CLOSE_MODAL,
            payload: null
        });
    }

    //FUNCTIONS INVOLVED IN UPDATING PLAYLIST (adding, editing, removing, moving songs)


    //ADDING
    store.addSong = function (SongTitle, SongArtist, SongYouTubeId, index) {
        async function asyncAddSong() {
            let playlist = store.currentList;
            let songs = playlist.songs;
            let name = playlist.name;
            songs.splice(index, 0, {title: SongTitle, artist: SongArtist, youTubeId: SongYouTubeId});
            let response = await api.updatePlaylist(store.currentList._id, name, songs);
            if(response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {list: playlist}
                })
            }
        }
        asyncAddSong();
    }

    //DELETING
    store.showDeleteSongModal = function (index){
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: {id: index}
        });
        let modal = document.getElementById("remove-song-modal");
        modal.classList.add("is-visible");
    }

    store.hideDeleteSongModal = function () {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.CLOSE_MODAL,
            payload: null
        });
    }

    store.deleteSong = function (index) {
        let playlist = store.currentList;
        let songs = playlist.songs;
        let name = playlist.name;
        songs.splice(index,1);
        async function asyncDeleteSong() {
            let response = await api.updatePlaylist(store.currentList._id, name, songs);
            if(response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {list: playlist}
                })
            store.hideDeleteSongModal();
            }
        }
        asyncDeleteSong();
    }

    
    //EDITING
    store.showEditSongModal = function(index){
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        let song = store.currentList.songs[index];
        document.getElementById("edit-song-modal-title-textfield").value = song.title;
        document.getElementById("edit-song-modal-artist-textfield").value = song.artist;
        document.getElementById("edit-song-modal-youTubeId-textfield").value = song.youTubeId;
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: {id: index}
        });
    }

    store.hideEditSongModal = function () {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
        storeReducer({
            type: GlobalStoreActionType.CLOSE_MODAL,
            payload: null
        });
    }

    store.editSong = function (newTitle, newArtist, newYouTubeId, index) {
        let playlist = store.currentList;
        let songs = playlist.songs;
        let name = playlist.name;
        songs[index] = {title: newTitle, artist: newArtist, youTubeId: newYouTubeId};
        async function asyncEditSong() {
            let response = await api.updatePlaylist(store.currentList._id, name, songs);
            if(response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {list: playlist}
                })
            store.hideEditSongModal();
            }
        }
        asyncEditSong();
    }

    //MOVE
    store.moveSong = function(start, end){
        let playlist = store.currentList;
        let songs = playlist.songs;
        let name = playlist.name;
        // WE NEED TO UPDATE THE STATE FOR THE APP
        if (start < end) {
            let temp = songs[start];
            for (let i = start; i < end; i++) {
                songs[i] = songs[i + 1];
            }
            songs[end] = temp;
        }
        else if (start > end) {
            let temp = songs[start];
            for (let i = start; i > end; i--) {
                songs[i] = songs[i - 1];
            }
            songs[end] = temp;
        }
        async function asyncMoveSong() {
            let response = await api.updatePlaylist(store.currentList._id, name, songs);
            if(response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: {list: playlist}
                })
            }
        }
        asyncMoveSong();
    }

    //UNDO REDO USING KEYS

    function KeyPress(event) {
        if (!store.modalOpen && event.ctrlKey){
            if(event.key === 'z'){
                store.undo();
            } 
            if(event.key === 'y'){
                store.redo();
            }
        }
  }
  
  document.onkeydown = (event) => KeyPress(event);

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}