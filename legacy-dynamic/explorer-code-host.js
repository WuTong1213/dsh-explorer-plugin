// DSH 动态 Cordis 插件 —— Host 半端
// 用法：把本文件整体内容作为 cordis_define 的 code.host 传入，然后 cordis_run。
// 职责：注入 fs 服务，注册两个 Package 私有方法供客户端调用：
//   explorer.list —— 列出某个目录的子项
//   explorer.read —— 读取某个文本文件内容（用于预览）
return {
  inject: ['fs'],
  apply(ctx) {
    const fs = ctx.fs

    // 只返回 JSON 安全字段，绝不返回 FsTarget / FsVersion / Cordis 等运行时对象。
    const toEntry = (e) => ({
      name: e.name,
      type: e.type, // 'file' | 'directory' | 'other'
      path: e.target.displayPath,
      size: typeof e.size === 'number' ? e.size : null,
    })

    // 列出一个目录（客户端总是传绝对路径）。
    harness.handle('explorer.list', async (args) => {
      const path = args && typeof args.path === 'string' && args.path.length > 0 ? args.path : '.'
      try {
        const target = await fs.resolve(path)
        const entries = await fs.listDir(target)
        return { path: target.displayPath, entries: entries.map(toEntry) }
      } catch (err) {
        return { path, entries: [], error: String((err && err.message) || err) }
      }
    })

    // 读取一个普通文本文件，用于预览面板。
    harness.handle('explorer.read', async (args) => {
      if (!args || typeof args.path !== 'string' || args.path.length === 0) return null
      try {
        const target = await fs.resolve(args.path)
        const content = await fs.readText(target)
        return { path: target.displayPath, content }
      } catch (err) {
        return { path: args.path, content: null, error: '无法预览：二进制或非文本文件' }
      }
    })
  },
}
