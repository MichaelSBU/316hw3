import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'
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
    MARK_SONG: "MARK_SONG"
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
        markedSongId: null
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
                    markedSongId: store.markedSongId
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    listNameActive: false,
                    markedListId: payload,
                    markedSongId: store.markedSongId
                });
            }
            // PREPARE TO Delete/Edit A songs
            case GlobalStoreActionType.MARK_SONG: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: payload
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    listNameActive: false,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    listNameActive: true,
                    markedListId: store.markedListId,
                    markedSongId: store.markedSongId
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
                console.log(playlist);
                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: playlist
                });
                store.loadIdNamePairs();
            }
        }
        console.log("creating new playlist");
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
                    response = await api.updatePlaylistById(playlist._id, playlist);
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
                console.log("API FAILED TO GET THE LIST PAIRS");
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
                        payload: playlist
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
    store.undo = function () {
        tps.undoTransaction();
    }
    store.redo = function () {
        tps.doTransaction();
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: null
        });
    }


    //FUNCTIONS INVOLVED IN DELETING PLAYLIST
    store.deletePlaylist = function (id) {
        async function asyncDeletePlaylist(id){
            console.log(id);
            let response = await api.deletePlaylist(id);
            if(response.data.success){
                store.loadIdNamePairs();
            }
        }
        console.log("deleting playlist");
        asyncDeletePlaylist(id);
        store.hideDeleteListModal();
        store.loadIdNamePairs();
        console.log("playlist deleted");
    }

    store.showDeleteListModal = function (_id) {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: _id
        });
    }

    store.hideDeleteListModal = function () {
        let modal = document.getElementById("delete-list-modal");
        modal.classList.remove("is-visible");
    }

    //FUNCTIONS INVOLVED IN UPDATING PLAYLIST (adding, editing, removing, moving songs)


    //ADDING
    store.addSong = function () {
        async function asyncAddSong() {
            let playlist = store.currentList;
            let songs = playlist.songs;
            let name = playlist.name;
            songs.push({title: "Untitled", artist: "Unknown", youTubeId: "dQw4w9WgXcQ"})
            let response = await api.updatePlaylist(store.currentList._id, name, songs);
            if(response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })
            }
        }
        console.log("adding song to playlist");
        asyncAddSong();
        console.log("added song to playlist");
    }


    //DELETING
    store.showDeleteSongModal = function (index){
        let modal = document.getElementById("remove-song-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: index
        });
    }

    store.hideDeleteSongModal = function () {
        let modal = document.getElementById("remove-song-modal");
        modal.classList.remove("is-visible");
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
                    payload: playlist
                })
            store.hideDeleteSongModal();
            }
        }
        console.log("deleting song " + index  + " from playlist");
        asyncDeleteSong();
        console.log("deleted song " + index + " from playlist");
    }

    
    //EDITING
    store.showEditSongModal = function(index){
        let modal = document.getElementById("edit-song-modal");
        modal.classList.add("is-visible");
        storeReducer({
            type: GlobalStoreActionType.MARK_SONG,
            payload: index
        });
    }

    store.hideEditSongModal = function () {
        let modal = document.getElementById("edit-song-modal");
        modal.classList.remove("is-visible");
    }

    store.editSong = function (index, newTitle, newArtist, newYouTubeId) {
        let playlist = store.currentList;
        let songs = playlist.songs;
        let name = playlist.name;
        songs[index] = {title: newTitle, artist: newArtist, youTubeId: newYouTubeId};
        async function asyncEditSong() {
            let response = await api.updatePlaylist(store.currentList._id, name, songs);
            if(response.data.success){
                storeReducer({
                    type: GlobalStoreActionType.SET_CURRENT_LIST,
                    payload: playlist
                })
            store.hideEditSongModal();
            }
        }
        console.log("editing " + index);
        asyncEditSong();
        console.log("edited song " + index);
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
                    payload: playlist
                })
            }
        }
        console.log("moving song at position" + start + " to position" + end);
        asyncMoveSong();
        console.log("move completed!");
    }



    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}