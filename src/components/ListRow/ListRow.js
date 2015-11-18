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
    const {
      avatarImg,
      link,
      title
    } = this.props
    return (
      <li>
        <img src={avatarImg}/>
        <Link to={link}>{title}</Link>
      </li>
    )
  }
}
