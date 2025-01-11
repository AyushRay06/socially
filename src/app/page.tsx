import Createpost from "@/components/Createpost"
import { Button } from "@/components/ui/button"
import { currentUser } from "@clerk/nextjs/server"

export default async function Home() {
  const user = await currentUser()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div>{user ? <Createpost /> : null}</div>
    </div>
  )
}
