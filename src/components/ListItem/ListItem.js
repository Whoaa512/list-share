import isEmpty from 'lodash.isempty'
import querystring from 'querystring'
import React, { Component, PropTypes } from 'react'
import { Row, Col, Input } from 'react-bootstrap'
import { Divider } from 'pui-react-dividers'
import { Link } from 'react-router'

export default class ListItem extends Component {
  static get propTypes () {
    return {
      currentUser: PropTypes.string,
      handleCheckbox: PropTypes.func,
      item: PropTypes.shape({
        checked: PropTypes.bool,
        checkedBy: PropTypes.string,
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
      currentUser,
      handleCheckbox,
      item,
      remove,
      showCheckbox = false,
      showEdit = false
    } = this.props
    const {
      checked,
      checkedBy,
      comments,
      id,
      link,
      title
    } = item
    let { imageUrl } = item
    const styles = require('./ListItem.scss')

    if (isEmpty(imageUrl)) {
      imageUrl = 'https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg'
    }
    let isCheckboxDisabled = false
    if (!isEmpty(checkedBy)) {
      isCheckboxDisabled = checkedBy !== currentUser
    }

    const xsColSizes = remove != null
      ? [1, 10, 10, 1]
      : [0, 10, 10, 1]
    const [removeXs, imgXs, detailsXs, editXs] = xsColSizes

    const mdColSizes = remove != null
      ? [1, 3, 8, 1]
      : [0, 4, 7, 1]
    const [removeMd, imgMd, detailsMd, editMd] = mdColSizes

    let href = link
    // @todo: move this tag addition to server
    if (link != null && typeof link.split === 'function') {
      let [ url, query ] = link.split('?')
      const parsedQuery = querystring.parse(query)
      query = '?' + querystring.stringify({
        tag: 'performe-20',
        ...parsedQuery
      })
      if (!isEmpty(url)) {
        href = `${url}${query}`
      }
    }

    return (
      <li className={styles.listItem}>
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
          <Col xs={detailsXs} md={detailsMd} mdOffset={1}>
            <Row>
              { !isEmpty(href)
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
                disabled={isCheckboxDisabled}
                label={<i className={styles.boughtIcon + ' fa fa-2 fa-gift'} />}
                onChange={(e) => handleCheckbox(item, this.refs.checkbox.getChecked())}
                ref='checkbox'
                type='checkbox'
            />
            }
          </Col>
        </Row>
        <Divider />
      </li>
    )
  }
}
