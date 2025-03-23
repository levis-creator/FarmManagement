import { Outlet } from "@remix-run/react"
import DashboardLayout from "~/components/dashboard/DashboardLayout"

const Layout = () => {
  return (
    <DashboardLayout>
      <Outlet/>
    </DashboardLayout>

  )
}

export default Layout