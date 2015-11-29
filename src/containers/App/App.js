import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, NavBrand, Nav, NavItem, CollapsibleNav } from 'react-bootstrap'
import DocumentMeta from 'react-document-meta'
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info'
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth'
import { isLoaded as areItemsLoaded, load as loadItems } from 'redux/modules/items'
import { pushState } from 'redux-router'
import connectData from 'helpers/connectData'
import config from '../../config'

function fetchData (getState, dispatch) {
  const promises = []
  if (!isInfoLoaded(getState())) {
    promises.push(dispatch(loadInfo()))
  }
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()))
  }
  if (!areItemsLoaded(getState())) {
    promises.push(dispatch(loadItems()))
  }
  return Promise.all(promises)
}

@connectData(fetchData)
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    location: PropTypes.object,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/')
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/login')
    }
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  render () {
    const { location, user } = this.props
    const styles = require('./App.scss')

    if (!__DEVELOPMENT__ && !user && location.pathname !== '/sign-up') {
      this.props.pushState(null, '/login')
    }

    return (
      <div className={styles.app}>
        <DocumentMeta {...config.app}/>
        <Navbar fixedTop toggleNavKey={0}>
          <NavBrand>
            <IndexLink to='/' activeStyle={{color: '#33e0ff'}}>
              <div className={styles.brand}/>
              <span>{config.app.title}</span>
            </IndexLink>
          </NavBrand>

          <CollapsibleNav eventKey={0}>
            <Nav navbar>
              {user &&
              <LinkContainer to='/my-list'>
                <NavItem eventKey={1}>My List</NavItem>
              </LinkContainer>}

              {!user &&
              <LinkContainer to='/login'>
                <NavItem eventKey={2}>Login</NavItem>
              </LinkContainer>}
              {!user &&
              <LinkContainer to='/sign-up'>
                <NavItem eventKey={3}>Sign Up</NavItem>
              </LinkContainer>}
              {user &&
              <LinkContainer to='/logout'>
                <NavItem eventKey={4} className='logout-link' onClick={this.handleLogout}>
                  Logout
                </NavItem>
              </LinkContainer>}
            </Nav>
            {user &&
            <p className={styles.loggedInMessage + ' navbar-text'}>Logged in as <strong>{user.name}</strong>.</p>}
            <Nav navbar right>
              <NavItem eventKey={1} target='_blank' title='View on Github' href='https://github.com/erikras/react-redux-universal-hot-example'>
                <i className='fa fa-github'/>
              </NavItem>
            </Nav>
          </CollapsibleNav>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <div className='well text-center'>
          Have questions? <a href='mailto:hello@presentsfor.me' target='_blank'>Contact us</a>.
        </div>
      </div>
    )
  }
}
