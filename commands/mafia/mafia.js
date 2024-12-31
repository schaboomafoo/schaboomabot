const maxPlayers = 20;

class Mafia{
    //ch is host channel, host is chatter who started the lobby
    //host's only real power is being able to force start the game, nothing beyond that
    
    constructor(ch, host){
        this.channel = ch; //host variable not needed, just know they will be first in players array
        this.started = 0; //0-unstarted, 2-lobby/filling, 1-running
        this.players = []; //total player list
        this.imps = []; //imposters / mafia members
        this.docs = []; //doctors / medics
        this.cops = []; //cops / investigators
        this.norm = []; //normal town members, (no role)
        
        this.state = 0; //general game state
        //0 - unstarted, nothing happening
        //1 - lobby portion
        //2 - day (discussion perion)
        //3 - night (whisper portion, mafia kills, doctor saves, cop checks)
        //4 - town win
        //5 - mafia win
    }

    reset(){ //reset lobby
        Object.assign(this, new Mafia);
    }


    addPlayer(player){
        if(this.state !== 1)
            return; //game isn't in lobby state, can't join

        if(this.players.length < maxPlayers){
            this.players.pop(player);
            return `welcome ${player}`;
        }
        else
            return `sorry ${player}, the lobby is full (${this.players.length}/${maxPlayers})`; //change to maxPlayeys / maxPlayers
    }

    createLobby(channel, host){
        if(started == 1)
            return; //trying to start game that is already started, do nothing
        else if(started == 2)
            this.addPlayer(host);
        
        else{ //game isn't started, create lobby
            this.channel = ch;
            this.started = 2;
            this.players.push(host); //this is the first entry in the array
        }
    }

    removePlayer(player){
        let index = this.players.indexOf(player);
        if(index !== -1){
            this.players.splice(index, 1);

            if(index == 0){ //host left lobby, new host assigned
                return `the host has left, ${this.players[0]} is the new lobby host}`;
            }

            if(this.players.length == 0){ //the last person in the lobby left, kill lobby
                this.reset();
                return `The last player has left the lobby, lobby is closed`;
            }

            return `${player}, you've been removed from the lobby`;
        }
        //return ""? or return nothing and printing nothing will be fine?
    }



    //functions as bool
    //"" - false (ongoing game) "mafia"/"town" - game is over, winner provided
    whoWon(){
        if(this.imps.length >= this.players.length)
            return "mafia";
        else if(this.imps.length == 0)
            return "town";
        return ""; //game is ongoing
    }

    townWin

}