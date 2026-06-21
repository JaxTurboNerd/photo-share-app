import { Client, Storage, ID } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '')

export const storage = new Storage(client)
export const PHOTOS_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || ''

export { ID }
export default client
