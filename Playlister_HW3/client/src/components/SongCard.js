import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    let isDragging = false;
    let draggedTo = false;

    let button = store.modalOpen ? "list-card-button-disabled" : "list-card-button";

    function handleDragStart(event){
        event.dataTransfer.setData("song", index);
        isDragging = true;
    }
    function handleDragOver (event){
        event.preventDefault();
        draggedTo = true;
    }
    function handleDragEnter(event){
        event.preventDefault();
        draggedTo = true;
    }
    function handleDragLeave(event){
        event.preventDefault();
        draggedTo = false
    }
    function handleDrop(event){
        event.preventDefault();
        let sourceIndex = Number(event.dataTransfer.getData("song"));
        isDragging = false;
        draggedTo = false;
        store.addMoveSongTransaction(sourceIndex, index);
    }

    function handleDeleteButtonPress(){
        store.showDeleteSongModal(index);
    }
    
    function handleClick(event){
        // DOUBLE CLICK IS FOR SONG EDITING
        if (event.detail === 1){

        }
        if (event.detail === 2) {
            store.showEditSongModal(index);
        }
    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onClick={handleClick}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
        >   
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className={button}
                value={"\u2715"}
                onClick={handleDeleteButtonPress}
            />
        </div>
    );
}

export default SongCard;