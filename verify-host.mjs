// Pre-restart verification for the host half.
// Mocks the Cordis connection service, captures the `/explorer` handler, and
// exercises the safe endpoints: no filesystem mutation and no Explorer window.
const mod = await import('./index.js')

let handler = null
const ctx = {
  inject(_deps, cb) {
    cb({ connection: { rpc: { handle(_channel, h) { handler = h; return () => {} } } } })
  },
}

function fail(msg) {
  console.error('FAIL: ' + msg)
  process.exit(1)
}

console.log('name            :', mod.name)
mod.apply(ctx)
if (typeof handler !== 'function') fail('rpc handler was never registered')
console.log('rpc channel     : /explorer (handler captured)')

const unknown = await handler('bogus', {})
if (unknown.ok !== false) fail('unknown endpoint should fail')
console.log('unknown endpoint:', unknown.error.code, '|', unknown.error.message)

const illegalName = await handler('rename', { path: 'C:\\x\\y.txt', name: '../evil' })
if (illegalName.ok !== false) fail('rename with a navigating name must be rejected')
console.log('rename ../evil  :', illegalName.error.code, '|', illegalName.error.message)

const slashName = await handler('mkdir', { path: 'C:\\x', name: 'a/b' })
if (slashName.ok !== false) fail('mkdir with a slash in the name must be rejected')
console.log('mkdir "a/b"     :', slashName.error.code, '|', slashName.error.message)

const dotDot = await handler('rename', { path: 'C:\\x\\y.txt', name: '..' })
if (dotDot.ok !== false) fail('rename to ".." must be rejected')
console.log('rename ".."     :', dotDot.error.code)

const noPath = await handler('rename', { path: '', name: 'ok.txt' })
if (noPath.ok !== false) fail('rename without a path must be rejected')
console.log('rename no path  :', noPath.error.code)

const here = import.meta.dirname
const listed = await handler('list', { path: here })
if (listed.ok !== true || !Array.isArray(listed.value.entries)) fail('list should return entries')
const names = listed.value.entries.map((e) => e.name)
console.log('list            :', names.length, 'entries ->', names.join(' '))
for (const required of ['index.js', 'client.js', 'cordis.patch.yml', 'package.json']) {
  if (!names.includes(required)) fail('list is missing ' + required)
}

const read = await handler('read', { path: here + '\\cordis.patch.yml' })
if (read.ok !== true || typeof read.value.content !== 'string') fail('read should return content')
console.log('read            : cordis.patch.yml,', read.value.content.length, 'chars')

console.log('OK: host half endpoints behave')
