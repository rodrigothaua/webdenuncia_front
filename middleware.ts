import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Verificar o tamanho do corpo da requisição para rotas de API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const contentLength = request.headers.get("content-length")

    // Limitar o tamanho para 10MB (10 * 1024 * 1024 bytes)
    if (contentLength && Number.parseInt(contentLength) > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Tamanho da requisição excede o limite de 10MB" }, { status: 413 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/api/:path*",
}