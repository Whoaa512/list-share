import isEmpty from 'lodash.isempty'
import querystring from 'querystring'
import React, { Component, PropTypes } from 'react'
import { Row, Col, Input } from 'react-bootstrap'
import { Divider } from 'pui-react-dividers'
import { Tooltip } from 'pui-react-tooltip'
import { OverlayTrigger } from 'pui-react-overlay-trigger'
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

    let boughtStyle = ''
    if (showCheckbox && checked) {
      boughtStyle = styles.bought
    }

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

    const boughtTooltip = <Tooltip>Mark a gift as bought! This info does not show to list owner.</Tooltip>
    const checkboxLabel = <OverlayTrigger placement='left' overlay={boughtTooltip}>
      <span className='overlay-trigger' tabIndex='0'><i className={`${styles.boughtIcon} fa fa-2 fa-gift`} /></span>
    </OverlayTrigger>

    const editTooltip = <Tooltip>Edit</Tooltip>
    const editIcon = <OverlayTrigger placement='left' overlay={editTooltip}>
      <span className='overlay-trigger' tabIndex='0'><i aria-label='Edit item' className={`${styles.boughtIcon}  fa fa-2 fa-gift`} /></span>
    </OverlayTrigger>

    return (
      <li className={`${styles.listItem} ${boughtStyle}`}>
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
              <p>
              { !isEmpty(href)
              ? <a target='blank' href={href}>{title}</a>
              : title
              }
              </p>
            </Row>
            <Row>
              {comments && <p>{comments}</p>}
            </Row>
          </Col>
          <Col className='pull-right' xs={editXs} md={editMd}>
            {showEdit && <Link className='text-muted' to={`/item/${id}/edit`}>{editIcon}</Link>}
            {showCheckbox &&
            <Input
                checked={checked}
                disabled={isCheckboxDisabled}
                label={checkboxLabel}
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
