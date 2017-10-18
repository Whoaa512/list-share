import analytics from 'helpers/analytics'
import React, { Component, PropTypes } from 'react'
import NotificationSystem from 'react-notification-system'
import { connect } from 'react-redux'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem } from 'react-bootstrap'
import DocumentMeta from 'react-document-meta'
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth'
import { isLoaded as areItemsLoaded, load as loadItems } from 'redux/modules/items'
import { isLoaded as areListsLoaded, load as loadLists } from 'redux/modules/lists'
import { isLoaded as isListMetaLoaded, load as loadListMeta } from 'redux/modules/listMeta'
import { isLoaded as areUsersLoaded, load as loadUsers } from 'redux/modules/users'
import { pushState } from 'redux-router'
import connectData from 'helpers/connectData'
import config from '../../config'
import defaultAvatarImg from 'default-avatar.png'

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
  if (!isListMetaLoaded(getState())) {
    promises.push(dispatch(loadListMeta()))
  }
  return Promise.all(promises)
}

@connectData(fetchData)
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
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

    analytics.create()
    analytics.set('page', page)
    setTimeout(() => {
      const title = document.title
      analytics.send('pageview', { page, title })
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
    analytics.set('page', page)
    setTimeout(() => {
      const title = document.title
      analytics.send('pageview', { page, title })
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
    const { user, location, pushState } = this.props
    const styles = require('./App.scss')
    const logo = require('./logo.png')

    if (user && location.pathname === '/login') {
      pushState(null, '/')
    }

    return (
      <div className={styles.app}>
        <DocumentMeta {...config.app}/>

        <Navbar fluid>
          <Navbar.Header>
            <IndexLink to='/'>
              <img className={styles.logo} src={logo}/>
            </IndexLink>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav>
              {user &&
              <LinkContainer to='/'>
                <NavItem eventKey={0}>All lists</NavItem>
              </LinkContainer>}
              {user &&
              <LinkContainer to='/my-list'>
                <NavItem eventKey={1}>My list</NavItem>
              </LinkContainer>}
              {user &&
              <LinkContainer to='/my-archived-items'>
                <NavItem eventKey={5}>My archived items</NavItem>
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
            <Nav pullRight>
              {user &&
              <p className={styles.loggedInMessage + ' navbar-text'}>Logged in as <strong>{user.name}</strong>.</p>
              }
              <NavItem eventKey={1}>
                <img
                    alt='avatar'
                    className={`${styles.avatarImage} img-responsive img-circle`}
                    src={defaultAvatarImg}
                />
              </NavItem>
            </Nav>
            }
          </Navbar.Collapse>
        </Navbar>

        <div className='notifications'>
          <NotificationSystem ref='notificationSystem' />
        </div>

        <div className={styles.appContent}>
          {this.props.children}
        </div>
        <div className={`well text-center ${styles.footer}`}>
        {/*
          Have questions? <a href='mailto:hello@presentsfor.me' target='_blank'>Contact us</a>.
        */}
          Got feedback? <a href='mailto:presentsfor.me.feedback@gmail.com' target='_blank'>We'd love to hear it!</a>.
        </div>
      </div>
    )
  }
}
