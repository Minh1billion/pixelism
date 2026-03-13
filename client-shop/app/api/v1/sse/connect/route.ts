import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const base = (process.env.BACKEND_INTERNAL_URL ?? 'http://shop-backend:8080/api/v1')
    .replace('/api/v1', '')

  const res = await fetch(`${base}/api/v1/sse/connect`, {
    headers: {
      'Cookie': request.headers.get('cookie') ?? '',
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  })

  if (!res.ok) {
    return new Response(null, {status: res.status})
  }

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}