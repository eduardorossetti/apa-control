import type { preHandlerHookHandler } from 'fastify'

type HandlerValues =
  | { preHandler: preHandlerHookHandler | preHandlerHookHandler[] }
  | preHandlerHookHandler
  | preHandlerHookHandler[]

export function composeHandler(...items: HandlerValues[]) {
  return { preHandler: items.flatMap((item) => ('preHandler' in item ? item.preHandler : item)) }
}
