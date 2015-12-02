import querystring from 'querystring'
import React, { Component, PropTypes } from 'react'
import { Grid, Row, Col, Input } from 'react-bootstrap'
import { Divider } from 'pui-react-dividers'
import { Link } from 'react-router'

export default class ListItem extends Component {
  static get propTypes () {
    return {
      handleCheckbox: PropTypes.func,
      item: PropTypes.shape({
        checked: PropTypes.bool,
        comments: PropTypes.string,
        id: PropTypes.string,
        imageUrl: PropTypes.string,
        link: PropTypes.string,
        title: PropTypes.string.isRequired
      }),
      remove: PropTypes.func,
      showCheckbox: PropTypes.bool,
      showEdit: PropTypes.bool
    }
  }

  render () {
    const {
      handleCheckbox,
      item,
      remove,
      showCheckbox = false,
      showEdit = false
    } = this.props
    const {
      checked,
      comments,
      id,
      imageUrl = 'https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg',
      link,
      title
    } = item
    const styles = require('./ListItem.scss')
    const xsColSizes = remove != null ? [1, 10, 10, 1] : [0, 10, 10, 1]
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
              <div onClick={remove}>
                <i className='fa fa-2 fa-times text-danger'/>
              </div>
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
              {showEdit && <Link className='text-muted' to={`/item/${id}/edit`}><i className='fa fa-pencil'/></Link>}
              {showCheckbox &&
              <Input
                  checked={checked}
                  label={<i className={styles.boughtIcon + ' fa fa-2 fa-gift'} />}
                  onChange={(e) => handleCheckbox(item, this.refs.checkbox.getChecked())}
                  ref='checkbox'
                  type='checkbox'
              />
              }
            </Col>
          </Row>
        </Grid>
        <Divider />
      </li>
    )
  }
}
