import amazon from 'amazon-product-api'

export default amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  awsTag: 'presentsfor.me'
})
