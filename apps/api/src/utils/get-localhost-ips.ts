import os from 'node:os'

export function getLocalhostIPs() {
  const interfaces = os.networkInterfaces()
  const ipAddresses = process.env.BYPASS_PROXY_IPS ? process.env.BYPASS_PROXY_IPS.split(',').map((ip) => ip.trim()) : []

  for (const interfaceName in interfaces) {
    for (const interfaceInfo of interfaces[interfaceName]!) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        ipAddresses.push(interfaceInfo.address)
      }
    }
  }

  return ipAddresses
}
