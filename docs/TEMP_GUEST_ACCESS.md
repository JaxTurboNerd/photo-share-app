# Temporary Guest Access (Testing Mode)

This document describes a **temporary** change that lets people use the live site
**without signing in**, and exactly how to undo it when testing is finished.

> ⚠️ This is a testing convenience, **not** a permanent authentication model.
> Restore the original login requirement (see below) once testing is complete.

---

## What changed

**File:** [`src/context/AuthContext.jsx`](../src/context/AuthContext.jsx)

Previously, when the app started and found no existing Appwrite session, it set
`user` to `null`, which caused the app to render the `<Login />` screen.

Now, when no session is found, the app first tries to create an **anonymous
guest session**. If that succeeds, the visitor is treated as a real (temporary)
Appwrite user and lands directly in the gallery with full **view / upload /
delete** access. Only if the anonymous session also fails does it fall back to
the login screen.

The changed block is marked with a `// TEMP:` comment for easy discovery.

### Current (guest-access) code

```js
try {
  const current = await account.get()
  if (active) setUser(current)
} catch {
  // TEMP: auto-guest access so testers can view/upload/delete without
  // signing in. Remove this inner try/catch (and restore `setUser(null)`)
  // to bring back the login requirement.
  try {
    await account.createAnonymousSession()
    if (active) setUser(await account.get())
  } catch (err) {
    console.error('Anonymous session failed:', err)
    if (active) setUser(null)
  }
} finally {
  if (active) setLoading(false)
}
```

---

## Appwrite settings this depends on

The code change alone is **not enough** — guest access only works if the
Appwrite project is configured to allow it. These are set in the
[Appwrite Console](https://cloud.appwrite.io), not in code:

1. **Auth → Settings → Anonymous** must be toggled **ON**.
   If it is off, guests get `Anonymous authentication is disabled for this
   project` and the app falls back to the login screen.

2. **Storage → (photos bucket) → Settings → Permissions** must grant
   **Create** and **Read** to the **Users** role. Anonymous sessions count as
   the `users` role, so if signed-in users can already upload and view, guests
   will too.

> Note: the owner-scoped delete logic in
> [`src/App.jsx`](../src/App.jsx) still applies — each guest can only delete
> photos they uploaded, enforced both client-side and server-side by Appwrite.

---

## How to restore the original login logic

Two steps — **both** are required to fully revert.

### 1. Revert the code

Restore the original `catch` block in
[`src/context/AuthContext.jsx`](../src/context/AuthContext.jsx) so it reads:

```js
try {
  const current = await account.get()
  if (active) setUser(current)
} catch {
  if (active) setUser(null)
} finally {
  if (active) setLoading(false)
}
```

That is: delete the inner `try/catch` that calls `createAnonymousSession()` and
restore the single `if (active) setUser(null)` line.

If the change was merged via a pull request, you can instead revert that PR/commit:

```sh
git revert <commit-sha>
```

### 2. Turn off Anonymous auth in Appwrite

In the [Appwrite Console](https://cloud.appwrite.io): **Auth → Settings →
Anonymous**, toggle it **OFF**. This stops any new guest sessions from being
created even if a stale build is still deployed.

After both steps and a redeploy, unauthenticated visitors will again see the
login screen.

---

## Reference

- Branch: `temp-guest-access`
- Pull request: <https://github.com/JaxTurboNerd/photo-share-app/pull/1>
