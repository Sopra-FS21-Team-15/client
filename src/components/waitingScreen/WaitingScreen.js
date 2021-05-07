import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import Lobby from "../shared/models/Lobby";
import Game from "../shared/models/Game";
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';
import { FormContainer } from '../../views/design/FormContainer.js';
import { Label } from '../../views/design/Label.js';
import { Legend } from '../../views/design/Legend.js';
import { InputField } from '../../views/design/InputField.js';
import { OneLineBlock } from '../../views/design/OneLineBlock.js';
import { SelectField } from '../../views/design/SelectField.js';
import Player from '../../views/Player';


const PlayerUl = styled.ul`
`;

const PlayerLi = styled.li`
  border: 1px solid grey;
  border-radius: 7px;
  padding: 7px;
  margin-bottom: 12px;
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const FloatLeft = styled.div`
  width: 50%;
  float: left;
`;

const FloatRight = styled.div`
  float: right;
  width: 50%;
`;

class waitingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
        lobbyId: localStorage.getItem('lobbyId'),
        loginId: localStorage.getItem('loginId'),
        username: localStorage.getItem('username'), // own username
        lobby: null,
        gamemode: "Classic",
        owner: false,
    };
    }

  async componentDidMount() {
    let intervalID = setInterval(async () => {
      // get lobby and update local lobby object
      try {
        const url = '/lobbies/' + this.state.lobbyId;
        const response = await api.get(url);
        let lobby = new Lobby(response.data);
        this.setState({ lobby });
      } catch(error) {
        alert(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
      }

      // Check if lobby is started, then go to draw screen
      if(this.state.lobby.status === "PLAYING") {
        try {
          const response = await api.get('/games/' + this.state.lobbyId + '/convert');
          const game = new Game(response.data);
          localStorage.setItem("gameId", game.id)
          this.props.history.push(`/draw`)
        } catch (error) {
          alert(`Something went wrong during the redirection to the started game: \n${handleError(error)}`);
        }
      }

      /// Find out who is the owner of the Lobby
      let owner_name = this.state.lobby.members[0];
      if (owner_name === this.state.username)
        this.setState({ owner: true });
      else
        this.setState({ owner: false });

      }, 3000);

    this.setState({ intervalID });

  }

  componentWillUnmount() {
    clearInterval(this.state.intervalID);
  }

  async startgame() {
    try {
      const requestBody = JSON.stringify({ id: this.state.lobbyId });
      const url = '/games/'+ this.state.lobbyId + '/start'
      const response = await api.post(url, requestBody);
      const game = new Game(response.data);

      // set the gameID
      localStorage.setItem("gameId", game.id)
      this.props.history.push(`/draw`)
    } catch (error) {
      alert(`Something went wrong during the starting the game: \n${handleError(error)}`);
    }
  }


  async goback() {
    try {
      const requestBody = JSON.stringify({
        username: localStorage.getItem('username')
      });

      const url = '/lobbies/' + this.state.lobbyId +'/leavers';
      await api.put(url, requestBody);

    } catch(error) {
      alert(`Something went wrong during the removing of a player: \n${handleError(error)}`)
    }
    this.props.history.push(`/game`);

  }

  remove_player(user){
    var a = user.id;
    var users = this.state.lobby.members;
    for (var i=0; i<users.length;i++){
      if (a===users[i].id){
        var kick = users[i]; // send this user to the backend
        // Api-Call to the backend to kick the user
      }
    }
  }


  handleInputChange(key, value) {
    // Example: if the key is username, this statement is the equivalent to the following one:
    // this.setState({'username': value});
    this.setState({ [key]: value });
  }

  render() {
    return (
      // Lobby list
      <BaseContainer>
          <Legend>Chill Area</Legend>
          {!this.state.lobby ? (
            <Spinner />
          ):(
            <div style={{overflow: "auto"}} >
            <FloatLeft>
            {this.state.lobby.members.map(user => {
              return(
                <PlayerUl>
                  <PlayerLi>{user}</PlayerLi>
                </PlayerUl>
              );
            })}
          </FloatLeft>
          <FloatRight>
          <FormContainer>
          <Label>Lobbyname</Label>
          <h2>{this.state.lobby.lobbyname}</h2>
          <Label>Gamemode</Label>
            <SelectField id="form_gamemode" disabled={this.state.disabled} onChange={e => {this.handleInputChange("gamemode", e.target.value);}}>
              <option value={this.state.gamemode}>{this.state.gamemode}</option>
              <option value="Classic">Classic</option>
              <option value="Pokemon">Pokemon</option>
            </SelectField>
            <h2>{this.state.gamemode}</h2>

          <Label>Max. Players</Label>
            <SelectField id="from_player" disabled={this.state.disabled} onChange={e => {this.handleInputChange("max_players", e.target.value);}}>
              <option value={this.state.lobby.size}>{this.state.lobby.size}</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </SelectField>
            <h2>{this.state.lobby.size}</h2>

          <Label>Rounds</Label>
            <SelectField id="from_rounds" disabled={this.state.disabled} onChange={e => {this.handleInputChange("rounds", e.target.value);}}>
              <option value={this.state.lobby.rounds}>{this.state.lobby.rounds}</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </SelectField>
            <h2>{this.state.lobby.rounds}</h2>

          <Label>Private</Label>
          <OneLineBlock>
          <InputField id="form_private" type="checkbox" disabled={!this.state.owner} onChange={e => {this.handleInputChange('private', e.target.checked);}} />
          {this.state.private ? (
              <div><Label>Password: {this.state.lobby.password}</Label>
              <InputField id="form_password" placeholder="Password"  onChange={e => {this.handleInputChange('password', e.target.value);}}/>
              </div>
          ) : ""  }
          </OneLineBlock>
            </FormContainer>
            </FloatRight>
            </div>
          )}
        

          <Button disabled={ !this.state.owner || (this.state.lobby && this.state.lobby.members.length < 2) } onClick={() => {this.startgame();}}>Start the Game</Button>
          <Button onClick={() => {this.goback();}}>Back</Button>
      </BaseContainer>
    );
  }
}

export default withRouter(waitingScreen);
