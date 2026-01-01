"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { SiGoogle } from "@icons-pack/react-simple-icons"
import { useState } from "react"
import { toast } from "sonner"

export function GoogleSignIn() {
    const [isLoading, setIsLoading] = useState(false)

    const handleSignIn = async () => {
        setIsLoading(true)
        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            })
        } catch (error) {
            toast.error("Failed to sign in with Google")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSignIn}
            disabled={isLoading}
        >
            <SiGoogle className="w-4 h-4" />
            Continue with Google
        </Button>
    )
}
