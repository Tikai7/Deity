
export const CLIENT_COUNT = "CLIENT_COUNT"
export const CAKE = "CAKE"
export const waitingTime = 2000

export function generateUID(tag) {
    const now = new Date().getTime()
    return `${tag}_${now}${Math.random().toString(16).substr(2)}`
}