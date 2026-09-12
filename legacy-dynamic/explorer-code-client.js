// DSH 动态 Cordis 插件 —— Client 半端（浏览器 UI）
// 用法：把本文件整体内容作为 cordis_define 的 code.client 传入，然后 cordis_run。
// 功能：
//   1) sidebar.workspaces          —— VS Code 风格文件树（展开/折叠、文件预览、新建文件夹、刷新、折叠全部）
//   2) conversation.session.header —— 按工作区分组的会话标签页（× 直接归档；归档当前会话时自动切到下一个已有会话）
const CSS = `
.vex-root{display:flex;flex-direction:column;height:100%;min-height:0;font-size:13px;}
.vex-header{display:flex;align-items:center;gap:2px;padding:6px 12px 4px;font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--dsw-alias-label-secondary,#8b949e);flex:none;}
.vex-header-title{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.vex-action{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:4px;color:inherit;cursor:pointer;font-size:12px;line-height:1;}
.vex-action:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.22));}
.vex-tree{flex:1;overflow:auto;padding-bottom:8px;}
.vex-row{display:flex;align-items:center;height:22px;gap:4px;cursor:pointer;color:var(--dsw-alias-label-primary,#e6edf3);white-space:nowrap;overflow:hidden;user-select:none;}
.vex-row:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.16));}
.vex-row.vex-selected{background:var(--dsw-alias-interactive-bg-selected,rgba(56,139,253,.24));}
.vex-chevron{width:16px;height:16px;flex:none;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;color:inherit;cursor:pointer;font-size:10px;padding:0;transition:transform .12s ease;}
.vex-chevron.vex-open{transform:rotate(90deg);}
.vex-chevron.vex-leaf{visibility:hidden;}
.vex-icon{flex:none;font-size:13px;line-height:1;}
.vex-name{overflow:hidden;text-overflow:ellipsis;}
.vex-empty{padding:4px 12px;color:var(--dsw-alias-label-secondary,#8b949e);font-size:12px;}
.vex-error{color:var(--dsw-alias-danger,#f85149);}
.vex-rail{width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:8px;font-size:18px;cursor:pointer;}
.vex-rail:hover{background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.22));}
.vex-new{flex:none;padding:2px 12px 4px;}
.vex-new input{width:100%;box-sizing:border-box;background:var(--dsw-alias-input-bg,transparent);border:1px solid var(--dsw-alias-border,#30363d);border-radius:4px;color:var(--dsw-alias-label-primary,#e6edf3);padding:3px 6px;font-size:12px;}
.vex-preview{flex:none;max-height:40%;overflow:auto;border-top:1px solid var(--dsw-alias-border,#30363d);background:var(--dsw-specific-sidebar-fill,transparent);}
.vex-preview pre{margin:0;padding:8px 12px;font-family:ui-monospace,Consolas,monospace;font-size:11px;white-space:pre-wrap;word-break:break-word;color:var(--dsw-alias-label-primary,#e6edf3);}
.vtb-root{flex:none;display:flex;flex-direction:column;background:var(--dsw-specific-sidebar-fill,transparent);border-bottom:1px solid var(--dsw-alias-border-l1,#30363d);}
.vtb-bar{display:flex;align-items:flex-end;gap:2px;padding:6px 8px 0;overflow-x:auto;overflow-y:hidden;}
.vtb-bar::-webkit-scrollbar{display:none;}
.vtb-new{flex:none;width:28px;height:28px;margin-bottom:2px;border:1px solid transparent;background:transparent;border-radius:6px;color:var(--dsw-alias-label-secondary,#8b949e);cursor:pointer;font-size:16px;line-height:1;}
.vtb-new:hover{background:var(--dsw-alias-interactive-bg-hover,#1f2430);color:var(--dsw-alias-label-primary,#e6edf3);}
.vtb-group{flex:none;display:inline-flex;align-items:center;gap:5px;height:32px;padding:0 8px 0 10px;margin-left:6px;border-left:2px solid var(--dsw-alias-border,#30363d);color:var(--dsw-alias-label-secondary,#8b949e);font-size:12px;font-weight:600;white-space:nowrap;}
.vtb-group-icon{font-size:13px;line-height:1;}
.vtb-group-title{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.vtb-group-active{color:var(--dsw-alias-accent,#58a6ff);border-left-color:var(--dsw-alias-accent,#58a6ff);}
.vtb-tab{display:flex;align-items:center;gap:6px;max-width:200px;min-width:120px;height:32px;padding:0 6px 0 12px;border:1px solid var(--dsw-alias-border,#30363d);border-bottom:none;border-radius:9px 9px 0 0;background:var(--dsw-alias-interactive-bg-subtle,#161b22);color:var(--dsw-alias-label-secondary,#8b949e);cursor:pointer;font-size:12px;user-select:none;flex:none;}
.vtb-tab:hover{background:#1f2430;color:var(--dsw-alias-label-primary,#e6edf3);}
.vtb-tab-active{background:var(--dsw-alias-interactive-bg-selected,#0d419d);color:#ffffff;}
.vtb-dot{width:7px;height:7px;border-radius:50%;flex:none;background:currentColor;opacity:.7;}
.vtb-tab-active .vtb-dot{opacity:1;}
.vtb-title{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left;}
.vtb-close{flex:none;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;border:none;background:transparent;border-radius:4px;color:inherit;cursor:pointer;font-size:14px;line-height:1;opacity:.55;}
.vtb-close:hover{opacity:1;background:var(--dsw-alias-interactive-bg-hover,rgba(128,128,128,.3));}
.vtb-context{display:flex;align-items:center;gap:8px;padding:4px 12px 8px;min-height:20px;}
.vtb-context-cwd{font-size:11px;color:var(--dsw-alias-label-secondary,#8b949e);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left;font-family:ui-monospace,Consolas,monospace;}
`

return {
  inject: ['slots', 'workspaces', 'sessions'],
  apply(ctx) {
    styles.insert(CSS)

    const basename = (p) => {
      const parts = String(p || '').split(/[\\/]/).filter(Boolean)
      return parts[parts.length - 1] || String(p || '')
    }
    const listChildren = (path) => host.call('explorer.list', { path })
    const readFile = (path) => host.call('explorer.read', { path })
    const createDirectory = (path, name) => ctx.workspaces.createDirectory(path, name)
    const openSession = (id) => ctx.sessions.open(id)
    const newSession = () => ctx.workspaces.startSession()

    function Row(props) {
      const { entry, depth, expanded, selected, onToggle, onSelect } = props
      const isDir = entry.type === 'directory'
      return React.createElement('div', {
        className: 'vex-row' + (selected ? ' vex-selected' : ''),
        style: { paddingLeft: String(8 + depth * 12) + 'px' },
        title: entry.path,
        onClick: () => onSelect(entry),
      },
        React.createElement('span', {
          className: 'vex-chevron' + (expanded ? ' vex-open' : '') + (isDir ? '' : ' vex-leaf'),
          onClick: (e) => { e.stopPropagation(); if (isDir) onToggle(entry) },
        }, '\u25B8'),
        React.createElement('span', { className: 'vex-icon' }, isDir ? (expanded ? '\uD83D\uDCC2' : '\uD83D\uDCC1') : '\uD83D\uDCC4'),
        React.createElement('span', { className: 'vex-name' }, entry.name),
      )
    }

    function Tree(props) {
      const { nodes, depth, childrenByPath, expanded, selectedPath, onToggle, onSelect } = props
      const out = []
      nodes.forEach((entry) => {
        const key = entry.path
        const isDir = entry.type === 'directory'
        const isOpen = !!expanded[key]
        const kids = childrenByPath[key]
        out.push(React.createElement(Row, {
          key, entry, depth,
          expanded: isOpen, selected: selectedPath === key,
          onToggle, onSelect,
        }))
        if (isDir && isOpen) {
          if (kids && kids.loading) {
            out.push(React.createElement('div', { key: key + ':loading', className: 'vex-empty', style: { paddingLeft: String(8 + (depth + 1) * 12) + 'px' } }, '加载中\u2026'))
          } else if (kids && kids.error) {
            out.push(React.createElement('div', { key: key + ':error', className: 'vex-empty vex-error', style: { paddingLeft: String(8 + (depth + 1) * 12) + 'px' } }, kids.error))
          } else if (kids && kids.entries) {
            out.push(React.createElement(Tree, {
              key: key + ':kids', nodes: kids.entries, depth: depth + 1,
              childrenByPath, expanded, selectedPath, onToggle, onSelect,
            }))
          }
        }
      })
      return React.createElement('div', null, out)
    }

    function Explorer(props) {
      const useWorkspaces = props.useWorkspaces
      const useSessions = props.useSessions
      const workspaces = useWorkspaces((s) => s)
      const sessions = useSessions((s) => s)
      const wide = props.wide
      const expandSidebar = props.expandSidebar

      const root = React.useMemo(() => {
        const cur = sessions.current
        const curRow = cur ? sessions.byId[cur] : undefined
        if (curRow && curRow.cwd) return { name: basename(curRow.cwd), path: curRow.cwd }
        const items = workspaces.items || []
        const recentId = workspaces.recentWorkspaceId
        const ws = items.find((w) => w.workspaceId === recentId) || items[0]
        return ws ? { name: ws.title || basename(ws.path), path: ws.path } : null
      }, [sessions.current, sessions.byId, workspaces.items, workspaces.recentWorkspaceId])

      const [childrenByPath, setChildrenByPath] = React.useState({})
      const [expanded, setExpanded] = React.useState({})
      const [selectedPath, setSelectedPath] = React.useState(null)
      const [preview, setPreview] = React.useState(null)
      const [naming, setNaming] = React.useState(false)
      const loadedRoot = React.useRef(null)

      const sortEntries = (list) => (list || []).slice().sort((a, b) =>
        ((a.type === 'directory' ? 0 : 1) - (b.type === 'directory' ? 0 : 1)) ||
        String(a.name).localeCompare(String(b.name)))

      const loadChildren = React.useCallback((path, force) => {
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

      React.useEffect(() => {
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

      if (!wide) {
        return React.createElement('button', {
          className: 'vex-rail', title: '资源管理器',
          onClick: expandSidebar,
        }, '\uD83D\uDCC1')
      }

      const rootEntry = root ? { name: root.name, type: 'directory', path: root.path } : null

      return React.createElement('div', { className: 'vex-root' },
        React.createElement('div', { className: 'vex-header' },
          React.createElement('span', { className: 'vex-header-title' }, '资源管理器'),
          React.createElement('button', { className: 'vex-action', title: '新建文件夹', onClick: () => setNaming(true) }, '\uFF0B'),
          React.createElement('button', { className: 'vex-action', title: '刷新', onClick: refresh }, '\u27F3'),
          React.createElement('button', { className: 'vex-action', title: '全部折叠', onClick: collapseAll }, '\u226A'),
        ),
        naming && React.createElement('div', { className: 'vex-new' },
          React.createElement('input', {
            autoFocus: true,
            placeholder: '文件夹名称',
            onKeyDown: (e) => {
              if (e.key === 'Enter') submitName(e.target.value)
              if (e.key === 'Escape') setNaming(false)
            },
            onBlur: (e) => submitName(e.target.value),
          }),
        ),
        React.createElement('div', { className: 'vex-tree' },
          rootEntry === null
            ? React.createElement('div', { className: 'vex-empty' }, '没有会话或工作区，请先添加工作区。')
            : React.createElement(Tree, {
                nodes: [rootEntry], depth: 0,
                childrenByPath, expanded, selectedPath,
                onToggle: toggle, onSelect: select,
              }),
        ),
        preview && React.createElement('div', { className: 'vex-preview' },
          preview.error
            ? React.createElement('pre', { className: 'vex-error' }, preview.error)
            : React.createElement('pre', null, preview.content),
        ),
      )
    }

    function SessionTabs(props) {
      const useSessions = props.useSessions
      const useWorkspaces = props.useWorkspaces
      const sessions = useSessions((s) => s)
      const workspaces = useWorkspaces((s) => s)
      const current = props.sessionId
      const byId = sessions.byId || {}

      const groups = React.useMemo(() => {
        const archived = new Set(workspaces.archivedSessionIds || [])
        const result = []
        const seen = new Set()
        const wsItems = workspaces.items || []
        wsItems.forEach((w) => {
          const ids = (w.sessionIds || []).filter((id) => !!byId[id] && !archived.has(id))
          ids.forEach((id) => seen.add(id))
          if (ids.length > 0) {
            result.push({ id: w.workspaceId, kind: 'workspace', title: w.title || basename(w.path), path: w.path, ids })
          }
        })
        const ungrouped = []
        const allIds = sessions.ids || []
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
      }, [workspaces.items, workspaces.archivedSessionIds, sessions.ids, byId, current])

      const archiveSession = (id) => {
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
        ctx.workspaces.archiveSession(id).catch(() => {})
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
        items.push(React.createElement('div', {
          key: 'g:' + g.id,
          className: 'vtb-group' + (g.id === activeGroupId ? ' vtb-group-active' : ''),
          title: g.path || g.title,
        },
          React.createElement('span', { className: 'vtb-group-icon' }, g.kind === 'workspace' ? '\uD83D\uDCC1' : '\uD83D\uDCC2'),
          React.createElement('span', { className: 'vtb-group-title' }, g.title),
        ))
        g.ids.forEach((id) => {
          const row = byId[id]
          if (!row) return
          const active = id === current
          items.push(React.createElement('div', {
            key: 't:' + id,
            className: 'vtb-tab' + (active ? ' vtb-tab-active' : ''),
            title: row.cwd || row.displayTitle,
            onClick: () => { if (!active) openSession(id) },
            onAuxClick: (e) => { if (e.button === 1) { e.preventDefault(); archiveSession(id) } },
          },
            React.createElement('span', { className: 'vtb-dot' }),
            React.createElement('span', { className: 'vtb-title' }, row.displayTitle || String(id)),
            React.createElement('span', { className: 'vtb-close', title: '归档会话', onClick: (e) => { e.stopPropagation(); archiveSession(id) } }, '\u00D7'),
          ))
        })
      })

      return React.createElement('div', { className: 'vtb-root' },
        React.createElement('div', { className: 'vtb-bar' },
          React.createElement('button', { className: 'vtb-new', title: '新建会话', onClick: newSession }, '+'),
          items,
        ),
        curRow && curRow.cwd
          ? React.createElement('div', { className: 'vtb-context' },
              React.createElement('span', { className: 'vtb-context-cwd', title: curRow.cwd }, curRow.cwd),
            )
          : null,
      )
    }

    // Both slots are `single` and the built-in UI already occupies them at
    // priority 0; register at a lower priority to shadow it (lowest renders).
    ctx.slots.inject('sidebar.workspaces', () => ctx.slots.register(
      { name: 'sidebar.workspaces', priority: -10 },
      Explorer,
    ))

    ctx.slots.inject('conversation.session.header', () => ctx.slots.register(
      { name: 'conversation.session.header', priority: -10 },
      SessionTabs,
    ))
  },
}
