import { type NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  const filename = req.nextUrl.searchParams.get('filename') ?? 'relic.png'

  if (!url) {
    return NextResponse.json({ error: 'Missing url' }, { status: 400 })
  }

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch image')

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') ?? 'image/png'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Download failed' }, { status: 500 })
  }
}