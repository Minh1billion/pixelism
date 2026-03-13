import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({
    apiUrl: process.env.API_URL ?? '/api/v1',
    backendUrl: process.env.BACKEND_URL ?? '',
  })
}