/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require('express')
const PlaylistController = require('../controllers/playlist-controller')
const router = express.Router()

//PLAYLIST STUFF
router.post('/playlist', PlaylistController.createPlaylist)
router.put('/playlist/:id', PlaylistController.updatePlaylist)
router.get('/playlists', PlaylistController.getPlaylists)
router.get('/playlistpairs', PlaylistController.getPlaylistPairs)
router.get('/playlist/:id', PlaylistController.getPlaylistById)
router.delete('/deletePlaylist/:id', PlaylistController.deletePlaylist)

module.exports = router