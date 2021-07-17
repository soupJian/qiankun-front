const microApps = [
  {
    name: "vue",
    entry: process.env.NODE_ENV === 'production' ? 'http://192.168.164.129:8081' : '//localhost:8081',
    container: '#container',
    activeRule: genActiveRule("/vue")
  },
  {
    name: "umi",
    entry: process.env.NODE_ENV === 'production' ? 'http://192.168.164.129:8000' : '//localhost:8000',
    container: '#container',
    activeRule: genActiveRule("/umi")
  },
]

function genActiveRule(routerPrefix) {
  return location => location.pathname.startsWith(routerPrefix);
}

export default microApps