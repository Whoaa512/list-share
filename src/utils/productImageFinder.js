import { client } from '../helpers/ApiClient'

export default function productImageFinder (asin) {
  return client.post('/productImage', { data: { asin } })
  .then((response) => response.imgUrl)
  .catch((err) => {
    console.error('Something went wrong with productFinder! ', err)
    throw err
  })
}
