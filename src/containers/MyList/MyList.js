import config from 'config'
import DocumentMeta from 'react-document-meta'
import React, { Component, PropTypes } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { ListItem } from 'components'

const LOL = [
  {
    description: 'Something cool',
    thumbnailUrl: 'https://images-na.ssl-images-amazon.com/images/I/41jPE6VzWnL._SY180_.jpg',
    link: 'http://smile.amazon.com/gp/product/B010MVSAI0',
    title: 'iPhone 6s Plus Case'
  },
  {
    description: 'Something cool',
    thumbnailUrl: 'https://images-na.ssl-images-amazon.com/images/I/51Zr25gV+WL._SS180_.jpg',
    link: 'http://smile.amazon.com/gp/product/B00TR8ZM86?redirect=true&ref_=s9_nps_hd_bw_g21_i2',
    title: 'GROOT'
  },
  {
    description: 'Something cool',
    thumbnailUrl: 'http://ecx.images-amazon.com/images/I/51RyV5a4QsL._SY180_.jpg',
    link: 'http://smile.amazon.com/gp/product/B00TR8ZM86',
    title: 'Tardis'
  }
]

export default class MyList extends Component {
  static get propTypes () {
    return {
      wat: PropTypes.string
    }
  }

  render () {
    const listItems = LOL.map(item =>
      <ListItem {...item} />
    )
    return (
      <div className='container'>
        <DocumentMeta title={`${config.app.title}: Lists`}/>
        <Grid>
          <Row>
            <Col xs={12} md={2}><h2>My List</h2></Col>
            <Col xs={4} xsOffset={8} md={3} mdOffset={9}>
              {/* hide if no items exist */}
              <button className='btn btn-default'>Edit</button>
              {/* hide if items exist */}
              <button className='btn btn-default'>Create New List</button>
            </Col>
          </Row>
          <Row ref='listItems'>
            {listItems}
          </Row>
        </Grid>
      </div>
    )
  }
}
