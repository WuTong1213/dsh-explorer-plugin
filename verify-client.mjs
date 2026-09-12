// Pre-restart verification for the client bundle.
// Mocks window.__ModuleLoader__, react and the Cordis client services, then
// executes the bundle exactly the way DSH would and renders both slot components.
let handoff = null
globalThis.window = {
  __ModuleLoader__: {
    load: (h) => { handoff = h },
  },
}

const reactMock = {
  createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
  useState: (init) => [typeof init === 'function' ? init() : init, () => {}],
  useEffect: () => {},
  useMemo: (fn) => fn(),
  useCallback: (fn) => fn,
  useRef: (init) => ({ current: init }),
}

function fail(msg) {
  console.error('FAIL: ' + msg)
  process.exit(1)
}

await import('./client.js')

if (handoff === null) fail('__ModuleLoader__.load was never called')
console.log('bundle id      :', handoff.id)

const mod = handoff.factory((name) => {
  if (name === 'react') return reactMock
  throw new Error('unexpected require: ' + name)
})

console.log('exports.apply  :', typeof mod.apply)
console.log('exports.inject :', JSON.stringify(mod.inject))
if (typeof mod.apply !== 'function') fail('exports.apply is not a function')
if (!Array.isArray(mod.inject)) fail('exports.inject is not an array')

const registered = []
const ctx = {
  get(name) {
    if (name === 'slots') {
      return {
        inject: (_key, cb) => { cb() },
        register: (opts, comp) => { registered.push({ opts, comp }); return () => {} },
      }
    }
    if (name === 'connection') {
      return { rpc: { call: async () => ({ ok: true, value: { path: '.', entries: [] } }) } }
    }
    if (name === 'workspaces') {
      return { createDirectory: async () => '', startSession: () => {}, archiveSession: async () => {} }
    }
    if (name === 'sessions') return { open: () => {} }
    return undefined
  },
}

mod.apply(ctx)

const names = registered.map((r) => r.opts.name)
console.log('registered     :', names.join(', '))
if (names.indexOf('sidebar.workspaces') < 0) fail('sidebar.workspaces not registered')
if (names.indexOf('conversation.session.header') < 0) fail('conversation.session.header not registered')

const useSessions = (sel) => sel({ ids: [], byId: {}, current: undefined })
const useWorkspaces = (sel) => sel({ items: [], archivedSessionIds: [], recentWorkspaceId: undefined })

const Explorer = registered.find((r) => r.opts.name === 'sidebar.workspaces').comp
const SessionTabs = registered.find((r) => r.opts.name === 'conversation.session.header').comp

if (Explorer({ useWorkspaces, useSessions, wide: true, expandSidebar: () => {} }) == null) fail('Explorer rendered null (wide)')
if (Explorer({ useWorkspaces, useSessions, wide: false, expandSidebar: () => {} }) == null) fail('Explorer rendered null (rail)')
if (SessionTabs({ useSessions, useWorkspaces, sessionId: undefined }) == null) fail('SessionTabs rendered null')

console.log('render check   : Explorer(wide) / Explorer(rail) / SessionTabs all non-null')
console.log('OK: client bundle structure valid')
