import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
const DeleteSongModal = () => {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    function handleConfirmDeletion() {
        store.deleteSong(store.markedSongId);
    }
    function handleCancelDeletion() {
        store.hideDeleteSongModal();
    }

    return (
            <div
                id="remove-song-modal"
                className="modal"
                data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-remove-song-root'>
                    <div className="modal-north">
                        Remove Song?
                    </div>
                    <div className="modal-center">
                        <div className="modal-center-content">
                            Are you sure you wish to permanently remove this song from the playlist?
                        </div>
                    </div>
                    <div className="modal-south">
                        <input type="button" id="remove-song-confirm-button" className="modal-button" onClick={handleConfirmDeletion} value='Confirm' />
                        <input type="button" id="remove-song-cancel-button" className="modal-button" onClick={handleCancelDeletion} value='Cancel' />
                    </div>
                </div>
            </div>
        );
    }
    export default DeleteSongModal;