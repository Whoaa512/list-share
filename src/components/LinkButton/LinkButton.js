import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { Button } from 'react-bootstrap'

export default class LinkButton extends Component {
  static propTypes = {
    buttonText: PropTypes.string.isRequired,
    linkTo: PropTypes.string,
    style: PropTypes.string
  }

  render () {
    const {
      buttonText,
      linkTo = '',
      style = ''
    } = this.props
    return (
      <Link to={linkTo} {...this.props}>
        <Button bsStyle={style} {...this.props}>{buttonText}</Button>
      </Link>
    )
  }
}

