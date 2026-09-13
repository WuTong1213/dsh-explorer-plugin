// DSH Explorer plugin — Host half.
//
// Self-contained on purpose: at profile top level DSH provides no `fs` service
// (`dsh-fs-local` is mounted per-agent inside the agent preset realm) and no
// `browse` capability, so this plugin talks to Node's own filesystem instead of
// injecting `fs`. Reads never mutate; the write surface is exactly three explicit
// operations: mkdir, rename, and revealing an entry in the OS file manager.
//
// Exposes one RPC channel `/explorer` with five endpoints:
//   list   — list one directory
//   read   — read a text file (preview pane)
//   mkdir  — create one child directory
//   rename — rename one entry in place
//   reveal — show one entry selected in the OS file manager
import { readdir, readFile, mkdir, rename as fsRename } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { spawn } from 'node:child_process'

export const name = 'dsh-explorer'

export function apply(ctx) {
  ctx.inject(['connection'], (connectionCtx) => {
    if (connectionCtx.connection === undefined) return
    connectionCtx.connection.rpc.handle('/explorer', async (endpoint, payload) => {
      if (endpoint === 'list') return listDir(payload)
      if (endpoint === 'read') return readTextFile(payload)
      if (endpoint === 'mkdir') return makeDir(payload)
      if (endpoint === 'rename') return renameEntry(payload)
      if (endpoint === 'reveal') return revealEntry(payload)
      return rpcError('not-found', 'unknown endpoint: ' + String(endpoint))
    }, { authority: 'loopback' })
  })
}

function rpcError(code, message) {
  return { ok: false, error: { code, message, details: {} } }
}

// Business outcome carrying an inline error the pane can render.
function businessError(path, message) {
  return { ok: true, value: { path, entries: [], error: message } }
}

function textOf(err) {
  return String((err && err.message) || err)
}

function absolutePath(payload) {
  if (!payload || typeof payload.path !== 'string' || payload.path.length === 0) return null
  return payload.path
}

// A rename/create target must be a single, non-navigating path segment.
function validSegment(name) {
  if (typeof name !== 'string') return null
  const trimmed = name.trim()
  if (trimmed.length === 0) return null
  if (trimmed === '.' || trimmed === '..') return null
  if (/[\\/]/.test(trimmed)) return null
  return trimmed
}

async function listDir(payload) {
  const path = absolutePath(payload) || '.'
  try {
    const dirents = await readdir(path, { withFileTypes: true })
    const entries = dirents.map((d) => ({
      name: d.name,
      type: d.isDirectory() ? 'directory' : d.isFile() ? 'file' : 'other',
      path: join(path, d.name),
      size: null,
    }))
    return { ok: true, value: { path, entries } }
  } catch (err) {
    return businessError(path, textOf(err))
  }
}

async function readTextFile(payload) {
  const path = absolutePath(payload)
  if (path === null) return { ok: true, value: null }
  try {
    const content = await readFile(path, 'utf8')
    return { ok: true, value: { path, content } }
  } catch (err) {
    return { ok: true, value: { path, content: null, error: '无法预览：二进制或非文本文件' } }
  }
}

async function makeDir(payload) {
  const parent = payload && typeof payload.path === 'string' ? payload.path : ''
  const name = validSegment(payload && payload.name)
  if (parent.length === 0 || name === null) {
    return rpcError('bad-request', '缺少目录路径，或名称不合法')
  }
  const target = join(parent, name)
  try {
    await mkdir(target)
    return { ok: true, value: { path: target } }
  } catch (err) {
    return rpcError('mkdir-failed', textOf(err))
  }
}

async function renameEntry(payload) {
  const path = absolutePath(payload)
  const name = validSegment(payload && payload.name)
  if (path === null || name === null) {
    return rpcError('bad-request', '缺少路径，或名称不合法')
  }
  const target = join(dirname(path), name)
  if (target === path) return { ok: true, value: { path } }
  try {
    await fsRename(path, target)
    return { ok: true, value: { path: target } }
  } catch (err) {
    return rpcError('rename-failed', textOf(err))
  }
}

async function revealEntry(payload) {
  const path = absolutePath(payload)
  if (path === null) return rpcError('bad-request', '缺少路径')
  try {
    // Detached so Explorer outlives this request; verbatim quoting keeps paths
    // containing spaces a single /select argument.
    const child = spawn('explorer.exe', ['/select,"' + path + '"'], {
      detached: true,
      stdio: 'ignore',
      windowsVerbatimArguments: true,
    })
    child.unref()
    return { ok: true, value: { path } }
  } catch (err) {
    return rpcError('reveal-failed', textOf(err))
  }
}
