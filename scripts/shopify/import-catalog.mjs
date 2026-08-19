// Recreates the REAL DOODLE catalogue (from doodle-backend's reconcile-catalog.ts
// + set-patch-stock.ts) in the new Shopify dev store, via the Admin GraphQL API's
// productSet mutation (one call per product: options + variants + inventory).
//
// Run: node scripts/shopify/import-catalog.mjs
// Reads SHOPIFY_ADMIN_API_TOKEN + NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN from .env.local.

import { config } from "dotenv"
config({ path: ".env.local" })

const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
const TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN
const API_VERSION = "2026-07"

if (!DOMAIN || !TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN or SHOPIFY_ADMIN_API_TOKEN in .env.local")
}

async function adminGraphQL(query, variables) {
  const res = await fetch(`https://${DOMAIN}/admin/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "X-Shopify-Access-Token": TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`)
  return json.data
}

// Sizes match the real signed spec sheet (src/app/size-guide in the frontend).
const SIZES = ["3-4Y", "5-6Y", "7-8Y", "9-10Y"]

// colourKey -> [stock per size, in SIZES order] — from doodle-backend's
// reconcile-catalog.ts, verified against Ash's stock sheet.
const TEE_STOCK = {
  blue: { name: "Sky Blue", stock: [29, 30, 29, 30] },
  pink: { name: "Blossom Pink", stock: [3, 3, 4, 2] },
  charcoal: { name: "Charcoal Grey", stock: [5, 4, 5, 5] },
  coral: { name: "Happy Orange", stock: [5, 2, 5, 5] },
  purple: { name: "Magic Lavender", stock: [3, 2, 4, 5] },
  yellow: { name: "Sunny Yellow", stock: [5, 5, 5, 3] },
}

const PACKS = [
  { handle: "epic-quest", title: "Epic Quest", stock: 0 },
  { handle: "moodicorns", title: "Moodicorns", stock: 0 },
  { handle: "space-squad", title: "Space Squad", stock: 1 },
  { handle: "sunny-pals", title: "Sunny Pals", stock: 1 },
  { handle: "tiny-travellers", title: "Tiny Travellers", stock: 1 },
]

const PATCH_STOCK = 880

async function getPrimaryLocationId() {
  const data = await adminGraphQL(`{ locations(first: 5) { nodes { id name } } }`)
  const loc = data.locations.nodes[0]
  if (!loc) throw new Error("No location found on this store")
  console.log(`Using location: ${loc.name} (${loc.id})`)
  return loc.id
}

const PRODUCT_SET_MUTATION = `
mutation ProductSet($input: ProductSetInput!) {
  productSet(synchronous: true, input: $input) {
    product { id title handle variants(first: 30) { nodes { sku price inventoryQuantity } } }
    userErrors { field message }
  }
}`

async function upsertProduct(input) {
  const data = await adminGraphQL(PRODUCT_SET_MUTATION, { input })
  const { product, userErrors } = data.productSet
  if (userErrors?.length) {
    console.error(`FAILED "${input.title}":`, JSON.stringify(userErrors))
    return null
  }
  console.log(`OK  ${product.title}  (${product.handle})  ${product.variants.nodes.length} variants`)
  return product
}

async function main() {
  const locationId = await getPrimaryLocationId()

  // --- DOODLE Modular Tee: 6 colours x 4 sizes ---
  const colours = Object.entries(TEE_STOCK)
  await upsertProduct({
    title: "DOODLE Modular Tee",
    handle: "modular-tee",
    descriptionHtml:
      "The soft 100% combed-cotton tee built to take patches. Pick a colour, snap on any patches, restyle whenever the mood changes. Sizes 3–10 yrs.",
    status: "ACTIVE",
    productOptions: [
      { name: "Colour", position: 1, values: colours.map(([, c]) => ({ name: c.name })) },
      { name: "Size", position: 2, values: SIZES.map((s) => ({ name: s })) },
    ],
    variants: colours.flatMap(([ck, c]) =>
      SIZES.map((s, i) => ({
        sku: `TEE-${ck.toUpperCase()}-${s}`,
        price: "999.00",
        optionValues: [
          { optionName: "Colour", name: c.name },
          { optionName: "Size", name: s },
        ],
        inventoryQuantities: [{ locationId, name: "available", quantity: c.stock[i] }],
      }))
    ),
  })

  // --- 5 themed patch packs ---
  for (const p of PACKS) {
    await upsertProduct({
      title: `DOODLE ${p.title}`,
      handle: p.handle,
      descriptionHtml: `${p.title} — a pack of 6 themed DOODLE patches. Snap them on, swap them out, collect the gang.`,
      status: "ACTIVE",
      productOptions: [{ name: "Pack", position: 1, values: [{ name: "Set of 6" }] }],
      variants: [
        {
          sku: `PACK-${p.handle.toUpperCase()}`,
          price: "799.00",
          optionValues: [{ optionName: "Pack", name: "Set of 6" }],
          inventoryQuantities: [{ locationId, name: "available", quantity: p.stock }],
        },
      ],
    })
  }

  // --- Single Rubber Patch ---
  await upsertProduct({
    title: "DOODLE Single Patch",
    handle: "patch",
    descriptionHtml: "One silicone DOODLE patch. Mix, match, and build your own set.",
    status: "ACTIVE",
    productOptions: [{ name: "Style", position: 1, values: [{ name: "Classic" }] }],
    variants: [
      {
        sku: "PATCH-01",
        price: "100.00",
        optionValues: [{ optionName: "Style", name: "Classic" }],
        inventoryQuantities: [{ locationId, name: "available", quantity: PATCH_STOCK }],
      },
    ],
  })

  console.log("\nDone. 7 products created/updated.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
