import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProfileContent } from "@/components/profile-content"

export default function ProfilePage() {
    return <ProfileContent header={<Header />} footer={<Footer />} />
}
