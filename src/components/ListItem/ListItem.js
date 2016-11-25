import { connect } from 'react-redux'
import isEmpty from 'lodash/isEmpty'
import bindAll from 'lodash/bindAll'
import querystring from 'querystring'
import React, { Component, PropTypes } from 'react'
import { Row, Col, Input } from 'react-bootstrap'
import { Divider } from 'pui-react-dividers'
import { Tooltip } from 'pui-react-tooltip'
import { OverlayTrigger } from 'pui-react-overlay-trigger'
import { Link } from 'react-router'
import { _notifier } from 'react-notification-system'

import { archive, unarchive } from 'redux/modules/items'

const styles = require('./ListItem.scss')

function mapStateToProps (state) {
  return {}
}
const actions = { archive, unarchive }

@connect(mapStateToProps, actions)
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
      archive: PropTypes.func,
      unarchive: PropTypes.func,
      remove: PropTypes.func,
      showCheckbox: PropTypes.bool,
      showArchive: PropTypes.bool,
      showUnarchive: PropTypes.bool,
      showEdit: PropTypes.bool
    }
  }

  constructor (props) {
    super(props)
    bindAll(this, [
      'handleUnarchive',
      'handleArchive'
    ])
  }

  handleArchive (e) {
    e.preventDefault()
    return this.props.archive(this.props.item.id)
    .then(() => {
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 3,
        message: 'Item archived!',
        level: 'success'
      })
    })
  }

  handleUnarchive (e) {
    e.preventDefault()
    return this.props.unarchive(this.props.item.id)
    .then(() => {
      _notifier.addNotification({
        position: 'tc',
        autoDismiss: 3,
        message: 'Item added back to your list!',
        level: 'success'
      })
    })
  }

  unarchiveIcon () {
    const tooltip = <Tooltip id='unarchive-item-tooltip'>Add back to list</Tooltip>
    return <OverlayTrigger placement='top' overlay={tooltip}>
      <span className='overlay-trigger' tabIndex='0'><i aria-label='Add back to list' className={`${styles.boughtIcon}  fa fa-2 fa-plus-square`} /></span>
    </OverlayTrigger>
  }

  render () {
    const {
      currentUser,
      handleCheckbox,
      item,
      remove,
      showCheckbox = false,
      showArchive = false,
      showUnarchive = false,
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

    let boughtStyle = ''
    if (showCheckbox && checked) {
      boughtStyle = styles.bought
    }

    if (isEmpty(imageUrl)) {
      imageUrl = 'https://d1luk0418egahw.cloudfront.net/static/images/guide/NoImage_592x444.jpg'
    }
    if (showCheckbox && checked) {
      imageUrl = 'http://personalsuccesstoday.com/wp-content/uploads/2007/03/bought-sign.jpg'
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

    const boughtTooltip = <Tooltip id='bought-gift-tooltip'>Mark a gift as bought! This info does not show to list owner.</Tooltip>
    const checkboxLabel = <OverlayTrigger placement='top' overlay={boughtTooltip}>
      <span className='overlay-trigger' tabIndex='0'><i className={`${styles.boughtIcon} fa fa-2 fa-gift`} /></span>
    </OverlayTrigger>

    const editTooltip = <Tooltip id='edit-item-tooltip'>Edit</Tooltip>
    const editIcon = <OverlayTrigger placement='top' overlay={editTooltip}>
      <span className='overlay-trigger' tabIndex='0'><i aria-label='Edit item' className={`${styles.boughtIcon}  fa fa-2 fa-pencil`} /></span>
    </OverlayTrigger>

    const archiveTooltip = <Tooltip id='archive-item-tooltip'>Archive</Tooltip>
    const archiveIcon = <OverlayTrigger placement='top' overlay={archiveTooltip}>
      <span className='overlay-trigger' tabIndex='0'><i aria-label='Archive item' className={`${styles.boughtIcon}  fa fa-2 fa-archive`} /></span>
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
          <Col className={styles.dim} xs={imgXs} md={imgMd}>
            <img src={imageUrl}/>
          </Col>
          <Col className={styles.dim} xs={detailsXs} md={detailsMd} mdOffset={1}>
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
          <Col className={`pull-right ${isCheckboxDisabled ? styles.dim : ''}`} xs={editXs} md={editMd}>
            {showEdit && <Link className='text-muted' to={`/item/${id}/edit`}>{editIcon}</Link>}
            {showEdit && showArchive && <span className='text-muted' >&nbsp;|&nbsp;</span>}
            {showArchive && <a className='text-muted' onClick={this.handleArchive}>{archiveIcon}</a>}
            {showUnarchive && <a className='text-muted' onClick={this.handleUnarchive}>{this.unarchiveIcon()}</a>}
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
