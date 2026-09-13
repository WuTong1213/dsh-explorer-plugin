// DSH Explorer plugin — Client bundle.
// Loaded by DSH through window.__ModuleLoader__.load (lazy CJS), NOT a plain ES module.
// Two slots:
//   sidebar.workspaces          — VS Code-style file tree
//   conversation.session.header — workspace-grouped session tabs
window.__ModuleLoader__.load({
  id: 'dsh-explorer-plugin',
  factory: (require) => {
    const bundleModule = { exports: {} }
    Object.defineProperty(bundleModule.exports, Symbol.toStringTag, { value: 'Module' })
    const react = require('react')

    const CSS = `
.vex-root{display:flex;flex-direction:column;height:100%;min-height:0;font-size:13px;}
.vex-header{display:flex;align-items:center;gap:2px;padding:6px 12px 4px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--dsw-alias-label-secondary);flex:none;}
.vex-header-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.vex-action{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:4px;color:inherit;cursor:pointer;font-size:12px;line-height:1;}
.vex-action:hover{background:rgba(128,128,128,.2);}
.vex-tree{flex:1;overflow:auto;padding-bottom:8px;}
.vex-row{display:flex;align-items:center;height:22px;gap:4px;cursor:pointer;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;user-select:none;}
.vex-row:hover{background:rgba(128,128,128,.16);}
.vex-row.vex-selected{background:rgba(128,128,128,.24);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 20%,transparent);}
.vex-chevron{width:16px;height:16px;flex:none;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;color:inherit;cursor:pointer;font-size:10px;padding:0;transition:transform .12s ease;}
.vex-chevron.vex-open{transform:rotate(90deg);}
.vex-chevron.vex-leaf{visibility:hidden;}
.vex-icon{flex:none;font-size:13px;line-height:1;}
.vex-name{overflow:hidden;text-overflow:ellipsis;}
.vex-empty{padding:4px 12px;color:var(--dsw-alias-label-secondary);font-size:12px;}
.vex-error{color:var(--dsw-alias-state-error-primary);}
.vex-rail{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:8px;font-size:18px;cursor:pointer;color:var(--dsw-alias-label-secondary);}
.vex-rail:hover{background:rgba(128,128,128,.2);}
.vex-new{flex:none;padding:2px 12px 4px;}
.vex-new input{width:100%;box-sizing:border-box;background:var(--dsw-alias-bg-base);border:1px solid var(--dsw-alias-border-l2);border-radius:4px;color:var(--dsw-alias-label-primary);padding:3px 6px;font-size:12px;}
.vex-preview{flex:none;max-height:40%;overflow:auto;border-top:1px solid var(--dsw-alias-border-l1);background:var(--dsw-specific-sidebar-fill);}
.vex-preview pre{margin:0;padding:8px 12px;font-family:ui-monospace,Consolas,monospace;font-size:11px;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-primary);}
.vex-menu{position:fixed;z-index:2147483000;min-width:168px;padding:4px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-overlay);box-shadow:0 10px 30px rgba(0,0,0,.28);font-size:12px;user-select:none;}
.vex-menu-item{padding:6px 10px;border-radius:5px;color:var(--dsw-alias-label-primary);cursor:pointer;white-space:nowrap;}
.vex-menu-item:hover{background:rgba(128,128,128,.2);}
.vtb-root{flex:none;display:flex;flex-direction:column;background:var(--dsw-specific-sidebar-fill);border-bottom:1px solid var(--dsw-alias-border-l1);}
.vtb-bar{display:flex;align-items:flex-end;gap:2px;padding:6px 8px 0;overflow-x:auto;overflow-y:hidden;scrollbar-width:thin;scrollbar-color:rgba(128,128,128,.45) transparent;}
.vtb-bar::-webkit-scrollbar{height:6px;}
.vtb-bar::-webkit-scrollbar-track{background:transparent;}
.vtb-bar::-webkit-scrollbar-thumb{background:rgba(128,128,128,.35);border-radius:3px;}
.vtb-bar::-webkit-scrollbar-thumb:hover{background:rgba(128,128,128,.6);}
.vtb-new{flex:none;width:28px;height:28px;margin-bottom:2px;border:1px solid transparent;background:transparent;border-radius:6px;color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:16px;line-height:1;}
.vtb-new:hover{background:rgba(128,128,128,.2);color:var(--dsw-alias-label-primary);}
.vtb-group{flex:none;display:inline-flex;align-items:center;gap:5px;height:32px;padding:0 8px 0 10px;margin-left:6px;border-left:2px solid var(--dsw-alias-border-l1);color:var(--dsw-alias-label-secondary);font-size:12px;font-weight:600;white-space:nowrap;}
.vtb-group-icon{font-size:13px;line-height:1;}
.vtb-group-title{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.vtb-group-active{color:var(--dsw-alias-brand-primary);border-left-color:var(--dsw-alias-brand-primary);}
.vtb-tab{display:flex;align-items:center;gap:6px;max-width:200px;min-width:120px;height:32px;padding:0 6px 0 12px;border:1px solid var(--dsw-alias-border-l1);border-bottom:none;border-radius:9px 9px 0 0;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);cursor:pointer;font-size:12px;user-select:none;flex:none;}
.vtb-tab:hover{background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);}
.vtb-tab-active{background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);border-color:var(--dsw-alias-brand-primary);font-weight:600;}
.vtb-dot{width:7px;height:7px;border-radius:50%;flex:none;background:currentColor;opacity:.5;}
.vtb-tab-active .vtb-dot{opacity:1;color:var(--dsw-alias-brand-primary);}
.vtb-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left;}
.vtb-close{flex:none;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:4px;color:inherit;cursor:pointer;font-size:14px;line-height:1;opacity:.55;}
.vtb-close:hover{opacity:1;background:rgba(128,128,128,.3);}
.vtb-context{display:flex;align-items:center;gap:8px;padding:4px 12px 8px;min-height:20px;}
.vtb-context-cwd{font-size:11px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left;font-family:ui-monospace,Consolas,monospace;}
`

    // Idempotent stylesheet injection — the module body runs at materialization.
    const CSS_TAG_ID = 'dsh-explorer-plugin/client.css'
    if (typeof document !== 'undefined') {
      if (document.querySelector('style[data-plugin-css=' + JSON.stringify(CSS_TAG_ID) + ']') === null) {
        const tag = document.createElement('style')
        tag.dataset.pluginCss = CSS_TAG_ID
        tag.textContent = CSS
        document.head.appendChild(tag)
      }
    }

    const basename = (p) => {
      const parts = String(p || '').split(/[\\/]/).filter(Boolean)
      return parts[parts.length - 1] || String(p || '')
    }

    function apply(ctx) {
      const slots = ctx.get('slots')
      const connection = ctx.get('connection')
      const workspaces = ctx.get('workspaces')
      const sessions = ctx.get('sessions')
      if (slots === undefined) return

      // Host RPC through the package-private `/explorer` channel.
      // The Host returns {ok:true,value} on success and {ok:false,error} on transport failure;
      // business errors travel inside `value` so the pane can render them inline.
      const callHost = async (endpoint, payload) => {
        if (connection === undefined) return { error: '连接未就绪' }
        let res
        try {
          res = await connection.rpc.call('/explorer', endpoint, payload)
        } catch (err) {
          return { error: String((err && err.message) || err) }
        }
        if (!res || res.ok !== true) {
          const message = res && res.error && res.error.message ? res.error.message : 'RPC 调用失败'
          return { error: message }
        }
        return res.value
      }
      // The host runs inside an Edge app window, so a bare right-click pops the
      // browser's own menu (Back / Reload / Save as / Inspect). Suppress it inside
      // plugin regions only, leaving DSH's own areas untouched.
      const stopBrowserMenu = (e) => { e.preventDefault() }
      const listChildren = (path) => callHost('list', { path })
      const readFile = (path) => callHost('read', { path })

      // Creation goes through our own RPC as well: the profile top level exposes no
      // `browse` capability, so `workspaces.createDirectory` would fail there.
      const createDirectory = async (path, name) => {
        const res = await callHost('mkdir', { path, name })
        if (res && res.error) throw new Error(res.error)
        return res
      }
      const openSession = (id) => {
        if (sessions === undefined) return
        sessions.open(id)
      }
      const newSession = () => {
        if (workspaces === undefined) return
        workspaces.startSession()
      }
      const archiveSession = (id) => {
        if (workspaces === undefined) return
        workspaces.archiveSession(id).catch(() => {})
      }

      function menuItem(label, onClick) {
        return react.createElement('div', { className: 'vex-menu-item', onClick }, label)
      }

      function Row(props) {
        const { entry, depth, expanded, selected, onToggle, onSelect, onContextMenu } = props
        const isDir = entry.type === 'directory'
        return react.createElement('div', {
          className: 'vex-row' + (selected ? ' vex-selected' : ''),
          style: { paddingLeft: String(8 + depth * 12) + 'px' },
          title: entry.path,
          onClick: () => onSelect(entry),
          onContextMenu: (e) => onContextMenu(entry, e),
        },
          react.createElement('span', {
            className: 'vex-chevron' + (expanded ? ' vex-open' : '') + (isDir ? '' : ' vex-leaf'),
            onClick: (e) => { e.stopPropagation(); if (isDir) onToggle(entry) },
          }, '\u25B8'),
          react.createElement('span', { className: 'vex-icon' }, isDir ? (expanded ? '\uD83D\uDCC2' : '\uD83D\uDCC1') : '\uD83D\uDCC4'),
          react.createElement('span', { className: 'vex-name' }, entry.name),
        )
      }

      function Tree(props) {
        const { nodes, depth, childrenByPath, expanded, selectedPath, onToggle, onSelect, onContextMenu } = props
        const out = []
        nodes.forEach((entry) => {
          const key = entry.path
          const isDir = entry.type === 'directory'
          const isOpen = !!expanded[key]
          const kids = childrenByPath[key]
          out.push(react.createElement(Row, {
            key, entry, depth,
            expanded: isOpen, selected: selectedPath === key,
            onToggle, onSelect, onContextMenu,
          }))
          if (isDir && isOpen) {
            if (kids && kids.loading) {
              out.push(react.createElement('div', { key: key + ':loading', className: 'vex-empty', style: { paddingLeft: String(8 + (depth + 1) * 12) + 'px' } }, '加载中\u2026'))
            } else if (kids && kids.error) {
              out.push(react.createElement('div', { key: key + ':error', className: 'vex-empty vex-error', style: { paddingLeft: String(8 + (depth + 1) * 12) + 'px' } }, kids.error))
            } else if (kids && kids.entries) {
              out.push(react.createElement(Tree, {
                key: key + ':kids', nodes: kids.entries, depth: depth + 1,
                childrenByPath, expanded, selectedPath, onToggle, onSelect, onContextMenu,
              }))
            }
          }
        })
        return react.createElement('div', null, out)
      }

      function Explorer(props) {
        const useWorkspaces = props.useWorkspaces
        const useSessions = props.useSessions
        const wsState = useWorkspaces((s) => s)
        const sessionsState = useSessions((s) => s)
        const wide = props.wide
        const expandSidebar = props.expandSidebar

        const root = react.useMemo(() => {
          const cur = sessionsState.current
          const curRow = cur ? sessionsState.byId[cur] : undefined
          if (curRow && curRow.cwd) return { name: basename(curRow.cwd), path: curRow.cwd }
          const items = wsState.items || []
          const recentId = wsState.recentWorkspaceId
          const ws = items.find((w) => w.workspaceId === recentId) || items[0]
          return ws ? { name: ws.title || basename(ws.path), path: ws.path } : null
        }, [sessionsState.current, sessionsState.byId, wsState.items, wsState.recentWorkspaceId])

        const [childrenByPath, setChildrenByPath] = react.useState({})
        const [expanded, setExpanded] = react.useState({})
        const [selectedPath, setSelectedPath] = react.useState(null)
        const [preview, setPreview] = react.useState(null)
        const [naming, setNaming] = react.useState(false)
        const [menu, setMenu] = react.useState(null)
        const [renaming, setRenaming] = react.useState(null)
        const loadedRoot = react.useRef(null)

        // Dismiss the context menu on any interaction outside it.
        react.useEffect(() => {
          if (!menu) return
          const close = () => setMenu(null)
          document.addEventListener('click', close)
          window.addEventListener('resize', close)
          return () => {
            document.removeEventListener('click', close)
            window.removeEventListener('resize', close)
          }
        }, [menu])

        const sortEntries = (list) => (list || []).slice().sort((a, b) =>
          ((a.type === 'directory' ? 0 : 1) - (b.type === 'directory' ? 0 : 1)) ||
          String(a.name).localeCompare(String(b.name)))

        const loadChildren = react.useCallback((path, force) => {
          setChildrenByPath((prev) => {
            const cur = prev[path]
            if (!force && cur && (cur.loading || cur.entries)) return prev
            return { ...prev, [path]: { loading: true, entries: null, error: null } }
          })
          listChildren(path).then(
            (res) => {
              if (res && res.error) {
                setChildrenByPath((prev) => ({ ...prev, [path]: { loading: false, entries: null, error: res.error } }))
              } else {
                const entries = sortEntries(res && res.entries)
                setChildrenByPath((prev) => ({ ...prev, [path]: { loading: false, entries, error: null } }))
              }
            },
            (err) => setChildrenByPath((prev) => ({ ...prev, [path]: { loading: false, entries: null, error: String((err && err.message) || err) } })),
          )
        }, [])

        react.useEffect(() => {
          if (!root || loadedRoot.current === root.path) return
          loadedRoot.current = root.path
          setExpanded((prev) => (prev[root.path] ? prev : { ...prev, [root.path]: true }))
          loadChildren(root.path)
        }, [root, loadChildren])

        const toggle = (entry) => {
          if (entry.type !== 'directory') return
          const open = !!expanded[entry.path]
          if (!open) loadChildren(entry.path)
          setExpanded((prev) => ({ ...prev, [entry.path]: !prev[entry.path] }))
        }

        const select = (entry) => {
          setSelectedPath(entry.path)
          setPreview(null)
          if (entry.type === 'file') {
            readFile(entry.path).then(
              (res) => {
                if (res && res.error) setPreview({ path: entry.path, error: res.error })
                else setPreview({ path: entry.path, content: (res && res.content) || '' })
              },
              (err) => setPreview({ path: entry.path, error: String((err && err.message) || err) }),
            )
          }
        }

        const refresh = () => {
          Object.keys(expanded).forEach((p) => loadChildren(p, true))
        }

        const collapseAll = () => setExpanded({})

        const submitName = (value) => {
          setNaming(false)
          const name = String(value || '').trim()
          if (!root || !name) return
          createDirectory(root.path, name)
            .then(() => loadChildren(root.path, true))
            .catch((err) => setPreview({ path: root.path, error: String((err && err.message) || err) }))
        }

        const parentOf = (p) => {
          const s = String(p || '')
          const cut = Math.max(s.lastIndexOf('\\'), s.lastIndexOf('/'))
          return cut > 0 ? s.slice(0, cut) : s
        }

        const copyText = (text) => {
          if (typeof navigator === 'undefined' || navigator.clipboard === undefined) return
          navigator.clipboard.writeText(text).catch(() => {})
        }

        const openEntryMenu = (entry, e) => {
          e.preventDefault()
          e.stopPropagation()
          setMenu({ x: e.clientX, y: e.clientY, entry })
        }

        const menuReveal = (entry) => {
          setMenu(null)
          callHost('reveal', { path: entry.path })
        }

        // A browser cannot hand a real file to the OS clipboard, so "copy" copies the
        // entry name; the full path keeps its own item below.
        const menuCopyName = (entry) => {
          setMenu(null)
          copyText(entry.name)
        }

        const menuCopyPath = (entry) => {
          setMenu(null)
          copyText(entry.path)
        }

        const menuRename = (entry) => {
          setMenu(null)
          setRenaming({ path: entry.path, name: entry.name })
        }

        const submitRename = (value) => {
          const target = renaming
          setRenaming(null)
          if (!target) return
          const name = String(value || '').trim()
          if (name.length === 0 || name === target.name) return
          callHost('rename', { path: target.path, name }).then((res) => {
            if (res && res.error) {
              setPreview({ path: target.path, error: res.error })
              return
            }
            loadChildren(parentOf(target.path), true)
          })
        }

        if (!wide) {
          return react.createElement('button', {
            className: 'vex-rail', title: '资源管理器',
            onClick: expandSidebar,
            onContextMenu: stopBrowserMenu,
          }, '\uD83D\uDCC1')
        }

        const rootEntry = root ? { name: root.name, type: 'directory', path: root.path } : null

        return react.createElement('div', { className: 'vex-root', onContextMenu: stopBrowserMenu },
          react.createElement('div', { className: 'vex-header' },
            react.createElement('span', { className: 'vex-header-title' }, '资源管理器'),
            react.createElement('button', { className: 'vex-action', title: '新建文件夹', onClick: () => setNaming(true) }, '\uFF0B'),
            react.createElement('button', { className: 'vex-action', title: '刷新', onClick: refresh }, '\u27F3'),
            react.createElement('button', { className: 'vex-action', title: '全部折叠', onClick: collapseAll }, '\u226A'),
          ),
          naming && react.createElement('div', { className: 'vex-new' },
            react.createElement('input', {
              autoFocus: true,
              placeholder: '文件夹名称',
              onKeyDown: (e) => {
                if (e.key === 'Enter') submitName(e.target.value)
                if (e.key === 'Escape') setNaming(false)
              },
              onBlur: (e) => submitName(e.target.value),
            }),
          ),
          renaming && react.createElement('div', { className: 'vex-new' },
            react.createElement('input', {
              autoFocus: true,
              defaultValue: renaming.name,
              placeholder: '新名称',
              onFocus: (e) => e.target.select(),
              onKeyDown: (e) => {
                if (e.key === 'Enter') submitRename(e.target.value)
                if (e.key === 'Escape') setRenaming(null)
              },
              onBlur: (e) => submitRename(e.target.value),
            }),
          ),
          react.createElement('div', { className: 'vex-tree' },
            rootEntry === null
              ? react.createElement('div', { className: 'vex-empty' }, '没有会话或工作区，请先添加工作区。')
              : react.createElement(Tree, {
                  nodes: [rootEntry], depth: 0,
                  childrenByPath, expanded, selectedPath,
                  onToggle: toggle, onSelect: select, onContextMenu: openEntryMenu,
                }),
          ),
          preview && react.createElement('div', { className: 'vex-preview' },
            preview.error
              ? react.createElement('pre', { className: 'vex-error' }, preview.error)
              : react.createElement('pre', null, preview.content),
          ),
          menu && react.createElement('div', {
            className: 'vex-menu',
            style: {
              left: Math.min(menu.x, (typeof window === 'undefined' ? 2000 : window.innerWidth) - 176) + 'px',
              top: Math.min(menu.y, (typeof window === 'undefined' ? 2000 : window.innerHeight) - 150) + 'px',
            },
            onClick: (e) => e.stopPropagation(),
            onContextMenu: (e) => { e.preventDefault(); e.stopPropagation() },
          },
            menuItem('打开（在资源管理器中显示）', () => menuReveal(menu.entry)),
            menuItem('复制名称', () => menuCopyName(menu.entry)),
            menuItem('重命名', () => menuRename(menu.entry)),
            menuItem('复制文件位置', () => menuCopyPath(menu.entry)),
          ),
        )
      }

      function SessionTabs(props) {
        const useSessions = props.useSessions
        const useWorkspaces = props.useWorkspaces
        const sessionsState = useSessions((s) => s)
        const wsState = useWorkspaces((s) => s)
        const current = props.sessionId
        const byId = sessionsState.byId || {}
        const barRef = react.useRef(null)
        const activeRef = react.useRef(null)

        // Keep the active tab reachable: with many tabs open it must never hide off-screen.
        react.useEffect(() => {
          const bar = barRef.current
          const el = activeRef.current
          if (!bar || !el) return
          const left = el.offsetLeft
          const right = left + el.offsetWidth
          if (left < bar.scrollLeft) bar.scrollTo({ left, behavior: 'smooth' })
          else if (right > bar.scrollLeft + bar.clientWidth) bar.scrollTo({ left: right - bar.clientWidth, behavior: 'smooth' })
        }, [current])

        // Mouse wheel scrolls the strip horizontally (a vertical wheel has nothing to do here).
        const onBarWheel = (e) => {
          const bar = barRef.current
          if (!bar) return
          bar.scrollLeft += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
        }

        const groups = react.useMemo(() => {
          const archived = new Set(wsState.archivedSessionIds || [])
          const result = []
          const seen = new Set()
          const wsItems = wsState.items || []
          wsItems.forEach((w) => {
            const ids = (w.sessionIds || []).filter((id) => !!byId[id] && !archived.has(id))
            ids.forEach((id) => seen.add(id))
            if (ids.length > 0) {
              result.push({ id: w.workspaceId, kind: 'workspace', title: w.title || basename(w.path), path: w.path, ids })
            }
          })
          const ungrouped = []
          const allIds = sessionsState.ids || []
          for (let i = 0; i < allIds.length; i++) {
            const id = allIds[i]
            if (seen.has(id) || archived.has(id) || !byId[id]) continue
            ungrouped.push(id)
          }
          if (current && byId[current] && !seen.has(current) && ungrouped.indexOf(current) < 0) {
            ungrouped.push(current)
          }
          if (ungrouped.length > 0) {
            result.push({ id: '__ungrouped__', kind: 'ungrouped', title: '未分组', path: null, ids: ungrouped })
          }
          return result
        }, [wsState.items, wsState.archivedSessionIds, sessionsState.ids, byId, current])

        const closeTab = (id) => {
          if (id === current) {
            const flatIds = []
            groups.forEach((g) => g.ids.forEach((sid) => flatIds.push(sid)))
            const idx = flatIds.indexOf(id)
            let next = null
            if (idx >= 0) {
              if (idx + 1 < flatIds.length) next = flatIds[idx + 1]
              else if (idx - 1 >= 0) next = flatIds[idx - 1]
            }
            if (next) openSession(next)
          }
          archiveSession(id)
        }

        const activeGroupId = (() => {
          if (!current) return null
          for (let i = 0; i < groups.length; i++) {
            if (groups[i].ids.indexOf(current) >= 0) return groups[i].id
          }
          return null
        })()

        const curRow = byId[current]

        const items = []
        groups.forEach((g) => {
          items.push(react.createElement('div', {
            key: 'g:' + g.id,
            className: 'vtb-group' + (g.id === activeGroupId ? ' vtb-group-active' : ''),
            title: g.path || g.title,
          },
            react.createElement('span', { className: 'vtb-group-icon' }, g.kind === 'workspace' ? '\uD83D\uDCC1' : '\uD83D\uDCC2'),
            react.createElement('span', { className: 'vtb-group-title' }, g.title),
          ))
          g.ids.forEach((id) => {
            const row = byId[id]
            if (!row) return
            const active = id === current
            items.push(react.createElement('div', {
              key: 't:' + id,
              ref: active ? activeRef : null,
              className: 'vtb-tab' + (active ? ' vtb-tab-active' : ''),
              title: row.cwd || row.displayTitle,
              onClick: () => { if (!active) openSession(id) },
              onAuxClick: (e) => { if (e.button === 1) { e.preventDefault(); closeTab(id) } },
            },
              react.createElement('span', { className: 'vtb-dot' }),
              react.createElement('span', { className: 'vtb-title' }, row.displayTitle || String(id)),
              react.createElement('span', { className: 'vtb-close', title: '归档会话', onClick: (e) => { e.stopPropagation(); closeTab(id) } }, '\u00D7'),
            ))
          })
        })

        return react.createElement('div', { className: 'vtb-root', onContextMenu: stopBrowserMenu },
          react.createElement('div', { className: 'vtb-bar', ref: barRef, onWheel: onBarWheel },
            react.createElement('button', { className: 'vtb-new', title: '新建会话（该工作区已有空闲会话时直接切过去）', onClick: newSession }, '+'),
            items,
          ),
          curRow && curRow.cwd
            ? react.createElement('div', { className: 'vtb-context' },
                react.createElement('span', { className: 'vtb-context-cwd', title: curRow.cwd }, curRow.cwd),
              )
            : null,
        )
      }

      // The host runs inside an Edge app window, so a bare right-click pops the
      // browser's own menu (Back / Reload / Save as / Inspect) instead of anything
      // app-like. Suppress it page-wide: plugin regions and DSH's own conversation
      // area alike. Owning it via ctx.effect means it disappears with the plugin.
      ctx.effect(() => {
        if (typeof document === 'undefined') return
        const suppressContextMenu = (e) => { e.preventDefault() }
        document.addEventListener('contextmenu', suppressContextMenu)
        return () => document.removeEventListener('contextmenu', suppressContextMenu)
      })

      // Both slots are `single` and the built-in UI already occupies them at
      // priority 0; register at a lower priority to shadow it (lowest renders).
      slots.inject('sidebar.workspaces', () => slots.register(
        { name: 'sidebar.workspaces', priority: -10 },
        Explorer,
      ))

      slots.inject('conversation.session.header', () => slots.register(
        { name: 'conversation.session.header', priority: -10 },
        SessionTabs,
      ))
    }

    bundleModule.exports.apply = apply
    bundleModule.exports.inject = ['slots', 'connection', 'workspaces', 'sessions']
    return bundleModule.exports
  },
})
