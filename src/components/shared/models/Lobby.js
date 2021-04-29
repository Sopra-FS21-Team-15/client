/**
 * Lobby Model
 */

class Lobby{
    constructor(data= {}) {
        this.lobbyName = null;
        this.lobbyId = null;
        this.rounds = null;
        this.private = null;
        this.maxPlayers = null;
        this.gameMode = null;
    }
}

export default Lobby;