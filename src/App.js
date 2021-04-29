import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Navbar';
import Dashboard from './components/Dashboard';
import AddCreatorForm from './components/AddCreator';
import CreatorsList from './components/ListCreators'
import AddPostForm from './components/AddPost';
import StreamList from './components/ListStreams';
import Following from './components/Following';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connected: false,
      account: null
    };

    // this.handleAccountChange();
  }

  async componentDidMount() {
    try {
      const account = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
      this.setState({ connected: true, account });
    } catch (error) {
      console.log(error.message);
    }
  }

  // handleAccountChange() {
  //   setInterval(async () => {
  //     // if (this.state.connected) {
  //       try {
  //         const account = (await window.ethereum.request({ method: 'eth_requestAccounts' }))[0];
  //         this.setState({ connected: true, account });
  //       } catch (error) {
  //         this.setState({ connected: false, account: null });
  //       }
  //     // }
  //   }, 1000);
  // }

  render() {
    return (
      <>
        {/* <Header account={this.state.account} />
        <AddCreatorForm /> */}
        <Router>
        <Header account={this.state.account} />
          <Switch>
            <Route path="/add-creator" exact component={AddCreatorForm} />
            <Route path="/view-creators" exact component={CreatorsList} />
            <Route path="/add-post" exact component={AddPostForm} />
            <Route path="/dashboard/:account" exact component={Dashboard} />
            <Route path="/streams/:account" exact component={StreamList} />
            <Route path="/following/:account" exact component={Following} />
          </Switch>
        </Router>
      </>
    );
  }
}

export default App;
