import React, { Component } from 'react'

import WeaponList from '../containers/WeaponList'
import store from '../store'
import imageConverter from '../utils/imageConverter'

var ipfsAPI = require('ipfs-api')
var nujaJson = require('../../build/contracts/Nuja.json')

const infoStyle = {
  position: 'relative',
  padding: '20px',
  width: '80%',
  minHeight: '100px',
  backgroundColor: 'rgba(240, 240, 240, 0.7)',
  boxShadow:'5px 5px rgba(0, 0, 0, 1)',
  marginRight: 'auto',
  marginLeft: 'auto',
  marginBottom: '20px'
};

class Player extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: null,
      web3: store.getState().web3.web3Instance,
      nujaBattle: store.getState().web3.nujaBattleInstance,
      nujaRegistry: store.getState().web3.nujaRegistryInstance,
      characterRegistry: store.getState().web3.characterRegistryInstance,
      nickname: '',     // Character info
      owner: null,
      nuja: 0,
      server: 0,
      health: 0,        // Server info
      number: 0,
      weaponList: <div></div>,
      imageData: '',    // Nuja info
      name: ''
    }

    store.subscribe(() => {
      this.setState({
        account: store.getState().account.accountInstance,
        web3: store.getState().web3.web3Instance,
        nujaBattle: store.getState().web3.nujaBattleInstance,
        nujaRegistry: store.getState().web3.nujaRegistryInstance,
        characterRegistry: store.getState().web3.characterRegistryInstance,
      });
    });
  }

  static defaultProps = {
    index: 0
  }

  componentWillMount() {
    var self = this
    var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001')


    if (self.state.characterRegistry != null) {
      self.state.characterRegistry.methods.getCharacterInfo(self.props.index).call().then(function(ret) {
        // Update character infos
        self.setState({
          nickname: ret.nicknameRet,
          owner: ret.ownerRet,
          nuja: ret.nujaRet,
          server: ret.currentServerRet,
        })

        // Retrieve server info
        if (self.state.nujaBattle != null) {
          if (self.state.account != null) {
            self.state.nujaBattle.methods.getIndexFromAddress(ret.currentServerRet, self.state.account.address).call().then(function(playerIndex) {
              self.state.nujaBattle.methods.playerInformation(ret.currentServerRet, playerIndex).call().then(function(playerInfo) {
                // Update server infos
                self.setState({
                  health: playerInfo.health,
                  number: playerIndex,
                })

                // Get the weapons
                self.setState({
                  weaponList: <WeaponList server={ret.currentServerRet} player={playerIndex}/>,
                })
              });
            });
          }
        }

        // Retrieve nuja info
        if (self.state.nujaRegistry != null) {
          self.state.nujaRegistry.methods.getContract(ret.nujaRet).call().then(function(addressRet) {
            var nujaContract = new self.state.web3.eth.Contract(nujaJson.abi, addressRet)

            nujaContract.methods.getMetadata().call().then(function(ipfsString) {
              ipfs.files.get(ipfsString + '/image.png', function (err, files) {
                self.setState({imageData: "data:image/png;base64,"+imageConverter(files[0].content)})
              })
              ipfs.files.get(ipfsString + '/name/default', function (err, files) {
                self.setState({name: files[0].content.toString('utf8')})
              })
            });
          });
        }
      });
    }
  }

  render() {
    return (
      <div style={infoStyle}>
        <h1>{this.state.number} - {this.state.nickname}</h1>
        <div className="row" style={{padding: '10px'}}>
          <div className="col-md-6" style={{}}>
            <img src={this.state.imageData} alt="Nuja" style={{width: '100%'}}></img>
          </div>
          <div className="col-md-6" style={{}}>
            <p>{this.state.name}</p>
            <p>Health: {this.state.health}</p>
          </div>
        </div>
        {this.state.weaponList}
        <p style={{fontSize: '10px'}}>{this.state.owner}</p>
      </div>
    );
  }
}


export default Player
