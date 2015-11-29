import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

export default class ListRow extends Component {
  static get propTypes () {
    return {
      avatarImg: PropTypes.string,
      link: PropTypes.string,
      title: PropTypes.string
    }
  }

  render () {
    const styles = require('./ListRow.scss')
    const {
      avatarImg,
      link,
      title
    } = this.props
    return (
      <li className={styles.listRow}>
        <img src={avatarImg}/>
        <Link to={link}>{title}</Link>
      </li>
    )
  }
}
