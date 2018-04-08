import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'


import store from '../store'
import '../css/bar.css'

var noop = function() {};

class Bar extends Component {
  constructor(props) {
    super(props)

    this.state = {
      account: null
    }

    store.subscribe(() => {
      this.setState({
        account: store.getState().account.accountInstance
      });
    });
  }

  static defaultProps = {
  }

  render() {

    if (this.state.account == null) {
      var addr = <p>No metamask</p>
    }
    else {
      var addr = <p>{this.state.account.address}</p>
    }

    return (
      <div>
        <nav style={{backgroundColor: '#26E7BC', position: 'relative', width: '100%', zIndex: 1, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
          <div className="container-fluid">
            <ul className="nav navbar-nav">
              <li className="navcell">
                <Link to="/play"><a className="navlink">Play <i className="fa fa-gamepad"></i></a></Link>
              </li>
              <li className="navcell">
                <Link to="/play"><a className="navlink">Collection <i className="fa fa-trophy"></i></a></Link>
              </li>
              <li className="navcell">
                <Link to="/play"><a className="navlink">Marketplace <i className="fa fa-shopping-basket"></i></a></Link>
              </li>
            </ul>
            <div className="addressStyle" style={{paddingTop: '13px'}}>{addr}</div>
          </div>
        </nav>
      </div>
    );
  }
}

// <div>
//   <nav style={{backgroundColor: '#26E7BC', position: 'fixed', width: '100%', zIndex: 1, boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)'}}>
//     <div className="container-fluid">
//       <div className="navbar-header">
//         <img src="/images/titleLight.png" style={{width: '200px', paddingTop: '13px', marginRight:'50px', marginLeft:'20px'}}></img>
//       </div>
//       <ul className="nav navbar-nav">
//         <li className="navcell">
//           <Link to="/play"><a className="navlink">Play <i className="fa fa-gamepad"></i></a></Link>
//         </li>
//         <li className="navcell">
//           <Link to="/play"><a className="navlink">Collection <i className="fa fa-trophy"></i></a></Link>
//         </li>
//         <li className="navcell">
//           <Link to="/play"><a className="navlink">Marketplace <i className="fa fa-shopping-basket"></i></a></Link>
//         </li>
//         <li className="navcell">
//           <Link to="/"><a className="navlink">Logout <i className="fa fa-arrow-left"></i></a></Link>
//         </li>
//       </ul>
//       <div className="addressStyle" style={{paddingTop: '13px'}}>{addr}</div>
//     </div>
//   </nav>
// </div>

export default Bar