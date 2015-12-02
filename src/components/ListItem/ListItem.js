import querystring from 'querystring'
import React, { Component, PropTypes } from 'react'
import { Button, Grid, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'

export default class ListItem extends Component {
  static get propTypes () {
    return {
      comments: PropTypes.string,
      id: PropTypes.string,
      imageUrl: PropTypes.string,
      link: PropTypes.string,
      remove: PropTypes.func,
      showEdit: PropTypes.bool,
      title: PropTypes.string.isRequired
    }
  }

  render () {
    const {
      comments,
      id,
      imageUrl = 'https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg',
      link,
      remove,
      showEdit = false,
      title
    } = this.props
    const styles = require('./ListItem.scss')
    const xsColSizes = remove != null ? [1, 11, 11, 1] : [0, 12, 11, 1]
    const mdColSizes = remove != null ? [1, 2, 8, 1] : [0, 2, 9, 1]
    const [removeMd, imgMd, detailsMd, editMd] = mdColSizes
    const [removeXs, imgXs, detailsXs, editXs] = xsColSizes
    let query = ''
    let url = link
    // @todo: move this tag addition to server
    if (link != null && typeof link.split === 'function') {
      [ url, query ] = link.split('?')
      const parsedQuery = querystring.parse(query)
      query = '?' + querystring.stringify({
        tag: 'performe-20',
        ...parsedQuery
      })
    }
    const href = `${url}${query}`

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
                { href != null
                ? <a target='blank' href={href}>{title}</a>
                : <p>{title}</p>
                }
              </Row>
              <Row>
                {comments && <p>{comments}</p>}
              </Row>
            </Col>
            <Col className='pull-right' xs={editXs} md={editMd}>
              {showEdit && <Link to={`/item/${id}/edit`}>Edit</Link>}
            </Col>
          </Row>
        </Grid>
      </li>
    )
  }
}
