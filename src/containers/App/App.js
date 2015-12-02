import React, { Component, PropTypes } from 'react'
import NotificationSystem from 'react-notification-system'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, CollapsibleNav } from 'react-bootstrap'
import DocumentMeta from 'react-document-meta'
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth'
import { isLoaded as areItemsLoaded, load as loadItems } from 'redux/modules/items'
import { isLoaded as areListsLoaded, load as loadLists } from 'redux/modules/lists'
import { isLoaded as areUsersLoaded, load as loadUsers } from 'redux/modules/users'
import { pushState } from 'redux-router'
import connectData from 'helpers/connectData'
import config from '../../config'

NotificationSystem._notifier = {}

function fetchData (getState, dispatch) {
  const promises = []
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()))
  }
  if (!areItemsLoaded(getState())) {
    promises.push(dispatch(loadItems()))
  }
  if (!areListsLoaded(getState())) {
    promises.push(dispatch(loadLists(null, true)))
  }
  if (!areUsersLoaded(getState())) {
    promises.push(dispatch(loadUsers()))
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

  componentDidMount () {
    const { location } = this.props
    const page = location.pathname + location.search
    this.latestUrl = page

    window.ga('create', config.gaUa, 'auto')
    window.ga('set', 'page', page)
    setTimeout(() => {
      const title = document.title
      window.ga('send', 'pageview', { page, title })
    })
    NotificationSystem._notifier = this.refs.notificationSystem
  }

  componentDidUpdate () {
    const { location } = this.props
    const page = location.pathname + location.search
    if (this.latestUrl === page) {
      return
    }
    this.latestUrl = page
    window.ga('set', 'page', page)
    setTimeout(() => {
      const title = document.title
      window.ga('send', 'pageview', { page, title })
    })
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
    const logo = require('./logo.png')

    if (!user && location.pathname !== '/sign-up') {
      this.props.pushState(null, '/login')
    }

    if (user && location.pathname === '/sign-up') {
      this.props.pushState(null, '/')
    }

    return (
      <div className={styles.app}>
        <DocumentMeta {...config.app}/>
        <Navbar fixedTop toggleNavKey={0}>
          <span className='pull-left'>
            <IndexLink to='/'>
              <img src={logo}/>
            </IndexLink>
          </span>

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
              {user &&
              <LinkContainer to='/logout'>
                <NavItem eventKey={4} className='logout-link' onClick={this.handleLogout}>
                  Logout
                </NavItem>
              </LinkContainer>}
            </Nav>
            {user &&
            <Nav navbar right>
              {user &&
              <p className={styles.loggedInMessage + ' navbar-text'}>Logged in as <strong>{user.name}</strong>.</p>
              }
              <NavItem eventKey={1}>
                <img
                    alt='avatar'
                    className={`${styles.avatarImage} img-responsive img-circle`}
                    src={user.avatarImg}
                />
              </NavItem>
            </Nav>
            }
          </CollapsibleNav>
        </Navbar>

        <div className='notifications'>
          <NotificationSystem ref='notificationSystem' />
        </div>

        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <div className='well text-center'>
        {/*
          Have questions? <a href='mailto:hello@presentsfor.me' target='_blank'>Contact us</a>.
        */}
          Have questions? <a href='mailto:presentsfor.me.feedback@gmail.com' target='_blank'>Contact us</a>.
        </div>
      </div>
    )
  }
}
