import url from 'url'
import React, { Component, PropTypes } from 'react'
import { Button, Grid, Row, Col } from 'react-bootstrap'

export default class ListItem extends Component {
  static get propTypes () {
    return {
      comments: PropTypes.string,
      imageUrl: PropTypes.string,
      link: PropTypes.string,
      remove: PropTypes.func,
      title: PropTypes.string
    }
  }

  render () {
    const {
      comments,
      imageUrl = 'https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg',
      link,
      remove,
      title
    } = this.props
    const styles = require('./ListItem.scss')
    const xsColSizes = remove != null ? [1, 11, 12] : [0, 12, 12]
    const mdColSizes = remove != null ? [1, 2, 9] : [0, 2, 10]
    const [removeMd, imgMd, detailsMd] = mdColSizes
    const [removeXs, imgXs, detailsXs] = xsColSizes
    const parsedLink = url.parse(link)
    const amazonLink = url.format({
      ...parsedLink,
      query: {
        ...parsedLink.query,
        tag: 'performe-20'
      }
    })
    return (
      <li className={styles.listItem}>
        <Grid>
          <Row>
            {remove != null &&
            <Col xs={removeXs} md={removeMd}>
              <Button bsStyle='default' onClick={remove}>
                <i className='fa fa-2 fa-times text-danger'/>
              </Button>
            </Col>
            }
            <Col xs={imgXs} md={imgMd}>
              <img src={imageUrl}/>
            </Col>
            <Col xs={detailsXs} md={detailsMd}>
              <Row>
                <a href={amazonLink}>{title}</a>
              </Row>
              <Row>
                {comments && <p>{comments}</p>}
              </Row>
            </Col>
          </Row>
        </Grid>
      </li>
    )
  }
}
