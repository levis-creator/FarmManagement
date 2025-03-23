import { Provider } from 'jotai'
import { ReactNode } from 'react'

const AtomProvider = ({ children }: { children: ReactNode }) => {
    return (
        <Provider>{children}</Provider>
    )
}

export default AtomProvider