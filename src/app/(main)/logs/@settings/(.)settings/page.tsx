// app/(main)/logs/@settings/(.)settings/page.tsx
import Settings from '@/app/(main)/_components/Settings'
import { Modal } from '@nextui-org/react'

export default function Page() {
    return (
        <Modal>
            <Settings />
        </Modal>
    )
}