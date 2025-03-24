import { Outlet } from "@remix-run/react"
import DashboardLayout from "~/components/dashboard/DashboardLayout"
import { Toaster } from "~/components/ui/toaster"

const Layout = () => {
  return (
    <DashboardLayout>
      <Outlet />
      <Toaster />
    </DashboardLayout>

  )
}

export default Layout