import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
const DeleteListModal = () => {
    const { store } = useContext(GlobalStoreContext);
    const history = useHistory();

    function handleConfirmDeletion() {
        store.deletePlaylist(store.markedListId._id);
    }
    function handleCancelDeletion() {
        store.hideDeleteListModal();
    }

    let name = store.markedListId === null ? "poo" : store.markedListId.name;

    return (
        <div 
            className="modal" 
            id="delete-list-modal" 
            data-animation="slideInOutLeft">
                <div className="modal-root" id='verify-delete-list-root'>
                    <div className="modal-north">
                        Delete playlist?
                    </div>
                        <div className="modal-center-content">
                            Are you sure you wish to permanently delete the {name} playlist?
                    </div>
                    <div className="modal-south">
                        <input type="button" 
                            id="delete-list-confirm-button" 
                            className="modal-button" 
                            onClick={handleConfirmDeletion}
                            value='Confirm' />
                        <input type="button" 
                            id="delete-list-cancel-button" 
                            className="modal-button" 
                            onClick={handleCancelDeletion}
                            value='Cancel' />
                    </div>
                </div>
        </div>
    );
}

export default DeleteListModal;