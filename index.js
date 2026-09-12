// DSH Explorer plugin — Host half.
//
// Self-contained on purpose: at profile top level DSH provides no `fs` service
// (`dsh-fs-local` is mounted per-agent inside the agent preset realm) and no
// `browse` capability, so this plugin talks to Node's own filesystem instead of
// injecting `fs`. All operations are read-only except `mkdir`.
//
// Exposes one RPC channel `/explorer` with three endpoints:
//   list  — list one directory
//   read  — read a text file (preview pane)
//   mkdir — create one child directory
import { readdir, readFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export const name = 'dsh-explorer'

export function apply(ctx) {
  ctx.inject(['connection'], (connectionCtx) => {
    if (connectionCtx.connection === undefined) return
    connectionCtx.connection.rpc.handle('/explorer', async (endpoint, payload) => {
      if (endpoint === 'list') return listDir(payload)
      if (endpoint === 'read') return readTextFile(payload)
      if (endpoint === 'mkdir') return makeDir(payload)
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
  const name = payload && typeof payload.name === 'string' ? payload.name.trim() : ''
  if (parent.length === 0 || name.length === 0) {
    return { ok: false, error: { code: 'bad-request', message: '缺少目录路径或名称', details: {} } }
  }
  if (name === '.' || name === '..' || /[\\/]/.test(name)) {
    return { ok: false, error: { code: 'bad-request', message: '名称不能包含路径分隔符', details: {} } }
  }
  const target = join(parent, name)
  try {
    await mkdir(target)
    return { ok: true, value: { path: target } }
  } catch (err) {
    return { ok: false, error: { code: 'mkdir-failed', message: textOf(err), details: {} } }
  }
}
