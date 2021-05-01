import React from 'react';
import styled from 'styled-components';
import { BaseContainer } from '../../helpers/layout';
import { api, handleError } from '../../helpers/api';
import WaitingPlayers from '../../views/waitinglist';
import Lobby from "../shared/models/Lobby";
import { Spinner } from '../../views/design/Spinner';
import { Button } from '../../views/design/Button';
import { withRouter } from 'react-router-dom';

const Container = styled(BaseContainer)`
  color: white;
  text-align: center;
  background: rgba(50, 50, 50, 0.9);
  border-radius: 10px;
  padding: 50px;
`;
const Layout = styled.div`
    display:flex;
    flex-direction:row;
    position:relative;
  `;
const UserlistContainer = styled.div`
    list-style: none;
    padding-left: 40px;
    padding-right: 340px;
`;

const PlayerContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const LobbyinformationContainer = styled.div`
  position: absolute
  float: right;
  right:50px;
`;
const Lobbyinformation = styled.li`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: right;
`;

const FormContainer = styled.div`
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: right;
  min-height: 300px;
  justify-content: right;
`;

const OneLineBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 60%;
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: linear-gradient(rgb(255,255,255), rgb(180, 190, 200));
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin: 12px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 1);
  color: black;
`;

const SelectField = styled.select`
  &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 1);
  color: black;
`;

const Label = styled.label`
  color: #999999;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  width: 100%;
`;

class waitingScreen extends React.Component {
  constructor() {
    super();
    this.state = {
        lobbyId: localStorage.getItem('lobbyId'),
        lobby: null,
        gamemode: null,
        loginId:1,// localStorage.getItem( 'loginId'),
        max_players: null,
        rounds: null,
        private: false,
        disabled:true,
        password:null,

        owner: false
    };
    }

  async getLobby(){
    try {
      const url = '/lobbies/' + this.state.lobbyId;
      const response = await api.get(url);
      let lobby = new Lobby(response.data);
      this.setState({ lobby });
    } catch(error) {
      alert(`Something went wrong while fetching the lobby: \n${handleError(error)}`);
    }

    if(this.state.lobby.members[0] === null)
      alert("Error: Member-list empty");

    /// Find out who is the owner of the Lobby
    let owner_id = this.state.lobby.members[0];
    if (owner_id === this.state.loginId)
      this.setState({ owner: true });
  }

  async componentDidMount() {
    this.getLobby(); // Get currenty lobby from backend

  }

  async startgame() {
     try{
        const requestBody_2 = JSON.stringify({
            gamemode: this.state.gamemode,
            max_players: this.state.max_players,
            rounds: this.state.rounds,
            // private: this.state.private,
            password: this.state.lobby.password,
            users: this.state.lobby.members,
        });

        const url = '/lobbies/'+ this.state.lobbyId;
        /** give the changes to the backend **/
        await api.put(url, requestBody_2);
        }
        catch (error) {
            alert(`Something went wrong during the starting the game: \n${handleError(error)}`);
        this.props.history.push(`/draw`)
        }

    return;
  }

async sendUser(user){
  try {
    const kickuser = JSON.stringify({
      user: user
    })
    const url = '/lobbies/' + this.state.lobbyId +'/leavers'
    await api.put(url, kickuser)
    } catch(error) {
      alert(`Something went wrong during the removing of a player: \n${handleError(error)}`)
  }
}

  goback() {
    var a = this.state.loginId;
    var users = this.state.lobby.members;
    for (var i=0; i<users.length;i++){
      if (a===users[i].id){
        var kick = users[i];
      }
    }
    this.sendUser(kick);
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
      <Container>
        <FormContainer>
          <h2>Chill Area</h2>
          <hr width="100%" />
          <Layout>
          {!this.state.lobby ? (
            <Spinner />
          ):(
            <UserlistContainer>
            {this.state.lobby.members.map(user => {
              return(
                <ul>
                  <li>{user}</li>
                </ul>
              );
              // return (
              //   <PlayerContainer key={user.id}>
              //   {this.state.owner ?
              //     <WaitingPlayers user={user} /> //f_onClick={() => this.remove_player(user)} add when necessary
              //   :
              //     <WaitingPlayers user={user}/>}
              //     </PlayerContainer>
              // );
            })}
            </UserlistContainer>
          )}

          <LobbyinformationContainer>
          <Lobbyinformation>
          <Label>Lobbyname</Label>
          <h2>{this.state.lobbyName}</h2>
          <Label>Gamemode</Label>

          {this.state.owner ?
            <SelectField id="form_gamemode" disabled={this.state.disabled} onChange={e => {this.handleInputChange("gamemode", e.target.value);}}>
              <option value={this.state.gamemode}>{this.state.gamemode}</option>
              <option value="Classic">Classic</option>
              <option value="Pokemon">Pokemon</option>
            </SelectField>
          :
            <h2>{this.state.gamemode}</h2>
          }

          <Label>Max. Players</Label>
          {this.state.owner ?
            <SelectField id="from_player" disabled={this.state.disabled} onChange={e => {this.handleInputChange("max_players", e.target.value);}}>
              <option value={this.state.max_players}>{this.state.max_players}</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </SelectField>
          :
            <h2>{this.state.max_players}</h2>
          }

          <Label>Rounds</Label>
          {this.state.owner ?
            <SelectField id="from_rounds" disabled={this.state.disabled} onChange={e => {this.handleInputChange("rounds", e.target.value);}}>
              <option value={this.state.rounds}>{this.state.rounds}</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </SelectField>
          :
            <h2>{this.state.rounds}</h2>
          }

          <Label>Private</Label>
          <OneLineBlock>
          <InputField id="form_private" type="checkbox" disabled={this.state.disabled} onChange={e => {this.handleInputChange('private', e.target.checked);}} />
          {this.state.private == true ? (
            this.state.owner ?
              <InputField id="form_password" placeholder="Password"  onChange={e => {this.handleInputChange('password', e.target.value);}}/>
            :
              <h2>Password: {this.state.password}</h2>
          ) : ""  }
          </OneLineBlock>
          </Lobbyinformation>
          </LobbyinformationContainer>
          </Layout>
          <hr width="100%" />

          <ButtonContainer>
            <Button disabled={ this.state.lobby && this.state.lobby.members.length <= 2 || this.state.disabled } width="25%" onClick={() => {this.startgame();}}>Start the Game</Button>
          </ButtonContainer>
          <ButtonContainer>
            <Button width="25%" onClick={() => {this.goback();}}>Back</Button>
          </ButtonContainer>
        </FormContainer>
      </Container>
    );
  }
}

export default withRouter(waitingScreen);
