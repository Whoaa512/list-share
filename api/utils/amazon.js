import amazon from '@whoaa/amazon-product-api'

const client = amazon.createClient({
  awsId: process.env.AWS_ID,
  awsSecret: process.env.AWS_SECRET,
  awsTag: 'presforme-20'
})

export default client
