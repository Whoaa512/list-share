import get from 'lodash/get'
import client from './utils/amazon'

export default function productImage (req, res, next) {
  const { asin } = req.body
  client.itemLookup({
    idType: 'ASIN',
    itemId: asin,
    responseGroup: 'Images'
  })
  .then((response) => {
    const imgUrl = get(response, '[0].MediumImage[0].URL[0]', null)
    res.json({ imgUrl })
  })
  .catch((err) => {
    console.error('Something went wrong with productFinder! ', err.stack)
    res.status(500).send({ message: 'Failed to find a product image' })
  })
}
