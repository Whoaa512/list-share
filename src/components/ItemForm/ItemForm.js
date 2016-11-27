import React, { Component, PropTypes } from 'react'
import { Panel, Row, Col } from 'react-bootstrap'
import { reduxForm, initialize } from 'redux-form'
import { Input, Button, ButtonToolbar } from 'react-bootstrap'
import { ListItem } from 'components'
import DollarRating from 'components/DollarRating'
import itemValidation from './itemValidation'

export const formName = 'item-form'

@reduxForm({
  form: formName,
  fields: ['title', 'imageUrl', 'link', 'priceRange', 'comments'],
  validate: itemValidation
})
export default class ItemForm extends Component {
  static propTypes = {
    cancelStyle: PropTypes.string,
    cancelText: PropTypes.string,
    handleCancel: PropTypes.func,
    dispatch: PropTypes.func.isRequired,
    fields: PropTypes.object.isRequired,
    itemToEdit: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    resetText: PropTypes.string,
    showPreview: PropTypes.bool,
    submitStyle: PropTypes.string,
    submitText: PropTypes.string,
    type: PropTypes.string
  }

  componentDidMount () {
    const {
      dispatch,
      itemToEdit,
      type
    } = this.props
    if (type === 'edit' && itemToEdit != null) {
      dispatch(initialize(formName, {
        comments: itemToEdit.comments,
        imageUrl: itemToEdit.imageUrl,
        link: itemToEdit.link,
        title: itemToEdit.title
      }))
    }
  }

  reset () {
    const { dispatch } = this.props
    dispatch(initialize(formName, {}))
  }

  render () {
    const styles = require('./ItemForm.scss')
    const {
      cancelStyle = 'link',
      cancelText = 'Cancel',
      handleCancel = () => void 0,
      fields: { title, imageUrl, link, priceRange, comments },
      handleSubmit,
      resetText = 'Clear',
      showPreview = false,
      submitStyle = 'primary',
      submitText = 'Add',
      type
    } = this.props

    const isEditing = type === 'edit'
    let previewItem
    if (showPreview) {
      previewItem = {
        title: title.value,
        imageUrl: imageUrl.value,
        link: link.value,
        priceRange: priceRange.value,
        comments: comments.value
      }
    }

    const renderInput = (type, field, label) => {
      const error = field.error && field.touched && <div className='text-danger'>{field.error}</div>
      return <Input type={type} label={label} addonAfter={error} {...field} />
    }
    const xsSizes = showPreview ? [12, 12] : [12, 0]
    const [xsForm, xsPreview] = xsSizes

    const mdSizes = showPreview ? [6, 5] : [11, 0]
    const [mdForm, mdPreview] = mdSizes

    return (
      <div className='form-horizontal'>
        <Row>
          <Col xs={xsForm} md={mdForm}>
            {renderInput('text', title, 'Item Title')}
            {renderInput('text', imageUrl, 'Image Link')}
            {renderInput('text', link, 'Purchase or Info Link')}
            <div className='form-group'>
              <label className='control-label'>
                <span>
                  Price Range
                </span>
              </label>
              <DollarRating
                  onChange={priceRange.onChange}
                  value={priceRange.value}
              />
            </div>
            {renderInput('textarea', comments, 'Additional comments')}
            <ButtonToolbar>
              <Button type='button' bsStyle={submitStyle} onClick={handleSubmit}>
                {submitText}
              </Button>
              <Button type='reset' onClick={this.reset.bind(this)}>
                {resetText}
              </Button>
              {isEditing &&
              <Button type='button' bsStyle={cancelStyle} onClick={handleCancel}>
                {cancelText}
              </Button>
              }
            </ButtonToolbar>
          </Col>
          <Col
              xs={xsPreview}
              md={mdPreview}
              mdOffset={1}
              className={showPreview ? styles.itemPreview : ''}
          >
            {showPreview &&
            <Panel
                defaultExpanded
                header={<h4>Item Preview:</h4>}
            >
              <ListItem item={previewItem} />
            </Panel>
            }
          </Col>
        </Row>
      </div>
    )
  }
}

ItemForm.formName = formName
