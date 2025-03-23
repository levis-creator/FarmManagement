import { PageHeader } from "~/components/common/PageHeader"
import RecentActivities from "./RecentActivities"
import { DashBoardCard } from "~/components/dashboard/DashBoardCard"

const Dashboard = () => {
    return (
        <>
            <PageHeader title="Dashboard" />
            <div>
                <div className="flex">
                    <DashBoardCard />
            
                </div>
                <RecentActivities/>
            </div>


        </>
    )
}

export default Dashboard