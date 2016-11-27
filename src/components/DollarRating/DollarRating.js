import classnames from 'classnames'
import React, { Component, PropTypes } from 'react'
import Rating from 'react-rating'
import { Row, Col } from 'react-bootstrap'
import { OverlayTrigger } from 'pui-react-overlay-trigger'
import { Tooltip } from 'pui-react-tooltip'
const styles = require('./DollarRating.scss')

export default class DollarRating extends Component {
  static get propTypes () {
    return {
      onChange: PropTypes.func,
      readonly: PropTypes.bool,
      value: PropTypes.number
    }
  }

  tooltip () {
    return <Tooltip id='dollar-legend'>
      <Row>
        <Col xs={4}>$</Col>
        <Col xs={2}><i className='fa fa-chevron-right'/></Col>
        <Col xs={2}>$1-$20</Col>
      </Row>
      <Row>
        <Col xs={4}>$$</Col>
        <Col xs={2}><i className='fa fa-chevron-right'/></Col>
        <Col xs={2}>$21-$40</Col>
      </Row>
      <Row>
        <Col xs={4}>$$$</Col>
        <Col xs={2}><i className='fa fa-chevron-right'/></Col>
        <Col xs={2}>$41-$60</Col>
      </Row>
      <Row>
        <Col xs={4}>$$$$</Col>
        <Col xs={2}><i className='fa fa-chevron-right'/></Col>
        <Col xs={2}>$61-$80</Col>
      </Row>
      <Row>
        <Col xs={4}>$$$$$</Col>
        <Col xs={2}><i className='fa fa-chevron-right'/></Col>
        <Col xs={2}>$81-$100+</Col>
      </Row>
    </Tooltip>
  }

  render () {
    const {
      onChange,
      readonly,
      value
    } = this.props

    return (
      <div>
        <OverlayTrigger placement='right' overlay={this.tooltip()}>
          <Rating
              empty={classnames('fa fa-usd', styles.emptyDollar, styles.dollar)}
              full={classnames('fa fa-usd', styles.fullDollar, styles.dollar)}
              initialRate={value}
              onChange={onChange}
              readonly={readonly}
          />
        </OverlayTrigger>
      </div>
    )
  }
}
