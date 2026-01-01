"use client"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { SiDiscord, SiFacebook } from "@icons-pack/react-simple-icons"
import { useState } from "react"
import { FaLinkedin } from 'react-icons/fa';
import { toast } from "sonner"

interface OAuthSignInProps {
    provider: "discord" | "facebook" | "linkedin"
}

export function OAuthSignIn({ provider }: OAuthSignInProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleSignIn = async () => {
        setIsLoading(true)
        try {
            await authClient.signIn.social({
                provider,
                callbackURL: "/",
            })
        } catch (error) {
            toast.error(`Failed to sign in with ${provider}`)
        } finally {
            setIsLoading(false)
        }
    }

    const getIcon = () => {
        switch (provider) {
            case "discord": return <SiDiscord className="w-4 h-4" />
            case "facebook": return <SiFacebook className="w-4 h-4" />
            case "linkedin": return <FaLinkedin className="w-4 h-4" />
        }
    }

    const getLabel = () => {
        return provider.charAt(0).toUpperCase() + provider.slice(1)
    }

    return (
        <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSignIn}
            disabled={isLoading}
        >
            {getIcon()}
            Continue with {getLabel()}
        </Button>
    )
}
