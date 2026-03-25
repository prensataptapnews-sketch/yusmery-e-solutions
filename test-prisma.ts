import prisma from "./src/lib/prisma"

async function test() {
  console.log("Prisma keys:", Object.keys(prisma))
  try {
    const count = await prisma.goal.count()
    console.log("Goal count:", count)
  } catch (e) {
    console.error("Goal count failed:", e)
  }
}

test()
