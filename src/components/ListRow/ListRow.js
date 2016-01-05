import React, { Component, PropTypes } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router'
import { OverlayTrigger } from 'pui-react-overlay-trigger'
import { Tooltip } from 'pui-react-tooltip'

export default class ListRow extends Component {
  static get propTypes () {
    return {
      anyPresentBought: PropTypes.bool,
      avatarImg: PropTypes.string,
      link: PropTypes.string,
      title: PropTypes.string
    }
  }

  render () {
    const styles = require('./ListRow.scss')
    const {
      anyPresentBought,
      // avatarImg,
      link,
      title
    } = this.props

    const boughtPresentTooltip = <Tooltip id='bought-present-tooltip'>You've bought at least 1 present from this list</Tooltip>
    const boughtPresentIcon = <OverlayTrigger placement='top' overlay={boughtPresentTooltip}>
      <span className='overlay-trigger' tabIndex='0'>
        <i aria-label='Present already bought' className={`${styles.boughtPresent} fa fa-check-circle-o`} />
      </span>
    </OverlayTrigger>

    return (
      <li className={styles.listRow}>
        <Row>
          {/* <img className={`${styles.avatarImage} img-responsive img-circle`} src={avatarImg}/> */}
          <Col xs={3} sm={1} md={1}>{anyPresentBought ? boughtPresentIcon : false}</Col>
          <Col><Link to={link}>{title}</Link></Col>
        </Row>
      </li>
    )
  }
}
