import React, { Component } from 'react'

import Player from '../components/Player'
import store from '../store'
import ipfsGet from '../utils/ipfsGet'

var nujaJson = require('../../build/contracts/Nuja.json')
var SW = require('../utils/stateWrapper')


class PlayerSprite extends Component {
  constructor(props) {
    super(props)

    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.state = {
      web3: store.getState().web3.web3Instance,
      nujaBattle: store.getState().web3.nujaBattleInstance,
      serverManager: store.getState().web3.serverManagerInstance,
      nujaRegistry: store.getState().web3.nujaRegistryInstance,
      characterRegistry: store.getState().web3.characterRegistryInstance,
      number: 0,
      imageLink: '',
      isHovering: false
    }

    store.subscribe(() => {
      this.setState({
        web3: store.getState().web3.web3Instance,
        nujaBattle: store.getState().web3.nujaBattleInstance,
        serverManager: store.getState().web3.serverManagerInstance,
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

    if (self.state.nujaBattle != null && self.state.serverManager != null) {
      if (self.state.characterRegistry != null) {

        self.state.characterRegistry.methods.getCharacterInfo(self.props.index).call().then(function(characterInfo) {
          // Retrieve server info
          self.state.serverManager.methods.getCharacterServer(self.props.index).call().then(function(currentServerRet) {
            if(currentServerRet > 0) {
              var currentServer = currentServerRet-1

              self.state.serverManager.methods.getIndexFromAddress(currentServer, characterInfo.ownerRet).call().then(function(playerIndex) {
                self.setState({
                  number: playerIndex,
                })
              })
            }
          })

          // Retrieve nuja info
          self.state.characterRegistry.methods.getCharacterNuja(self.props.index).call().then(function(characterNuja) {
            if (self.state.nujaRegistry != null) {
              self.state.nujaRegistry.methods.getContract(characterNuja).call().then(function(addressRet) {
                var nujaContract = new self.state.web3.eth.Contract(nujaJson.abi, addressRet)
                nujaContract.methods.getMetadata().call().then(function(ipfsString) {
                  self.setState({imageLink: 'https://ipfs.infura.io' + ipfsString + '/sprite.gif'})
                })
              })
            }
          })

        })
      }
    }
  }

  // Event functions to render description
  handleMouseHover() {
    this.setState({isHovering: true});
  }

  handleMouseLeave() {
    this.setState({isHovering: false});
  }

  render() {
    var health = SW.getPlayerHealth(this.state.number)
    var positions = SW.getPlayerPosition(this.state.number)
    var offsetX = positions[0]*64+15
    var offsetY = positions[1]*64+15
    var desc = <div></div>

    if (this.state.isHovering) {
      desc = <Player index={this.props.index} />
    }

    // If player is dead, we render nothing
    if(health == 0) {
      return(null)
    }
    else {
      return (
        <div onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseLeave}>
          <img src={this.state.imageLink} alt="Nuja" style={{
            width: '32px',
            position: 'absolute',
            top: offsetY+'px',
            left: offsetX+'px'
          }}></img>
          <div style={{
            top: offsetY-100+'px',
            left: offsetX+40+'px',
            width: '350px',
            position: 'absolute',
            zIndex: 999
          }}
          >{desc}</div>
        </div>
      );
    }
  }
}

export default PlayerSprite
