import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    // 1) 항상 pass-through 응답 생성
    let response = NextResponse.next({ request })

    // 2) SSR용 Supabase 클라이언트 (쿠키 동기화)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 3) 세션 갱신만 하고, 리디렉션은 전혀 하지 않음
    await supabase.auth.getUser()

    return response
}
