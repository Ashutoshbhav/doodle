import { getCartLineCount } from "@/lib/medusa/cart"
import { Nav } from "./Nav"

export async function NavWithCart() {
  const count = await getCartLineCount()
  return <Nav cartCount={count} />
}
