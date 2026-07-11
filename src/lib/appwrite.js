import { Client, Storage, Account, ID, Permission, Role } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '')

export const storage = new Storage(client)
export const account = new Account(client)
export const PHOTOS_BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || ''

export { ID, Permission, Role }

// Derive the uploader's user id from a file's permission list. On upload we
// grant the owner an explicit delete permission (delete("user:<id>")), so the
// presence of that rule is what identifies who owns the photo.
export function ownerIdFromPermissions(permissions = []) {
  for (const perm of permissions) {
    const match = /^delete\("user:([^"]+)"\)$/.exec(perm)
    if (match) return match[1]
  }
  return null
}

export default client
