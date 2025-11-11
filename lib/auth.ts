import { cookies } from "next/headers"

export async function checkAdminAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin_session")

    if (session && session.value.startsWith("admin_session_")) {
      return true
    }

    return false
  } catch (error) {
    console.error("Auth check error:", error)
    return false
  }
}

