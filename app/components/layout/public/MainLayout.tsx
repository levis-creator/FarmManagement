import { ReactNode } from "react"
import NavBar from "./NavBar"

const MainLayout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <NavBar />
            <main className="min-h-[calc(100vh-80px)]">
                {children}
            </main>
        </>
    )
}

export default MainLayout