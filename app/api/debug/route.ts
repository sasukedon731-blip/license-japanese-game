import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export function GET(request: Request) {
  const url = new URL(request.url)

  return NextResponse.json({
    url: url.toString(),
    pathname: url.pathname,
    search: url.search,
    type: url.searchParams.get('type'),
    allParams: Object.fromEntries(url.searchParams.entries()),
  })
}
