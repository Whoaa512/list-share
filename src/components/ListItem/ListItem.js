import React, { Component, PropTypes } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'

export default class ListItem extends Component {
  static get propTypes () {
    return {
      description: PropTypes.string,
      thumbnailUrl: PropTypes.string,
      link: PropTypes.string,
      title: PropTypes.string
    }
  }

  render () {
    const {
      description,
      thumbnailUrl,
      link,
      title
    } = this.props
    const styles = require('./ListItem.scss')
    return (
      <li className={styles.listItem}>
        <Grid>
          <Row>
            <Col xs={12} md={2}>
              <img src={thumbnailUrl}/>
            </Col>
            <Col xs={12} md={10}>
              <Row>
                <Link to={link}>{title}</Link>
              </Row>
              <Row>
                {description && <p>{description}</p>}
              </Row>
            </Col>
          </Row>
        </Grid>
      </li>
    )
  }
}
