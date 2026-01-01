"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { Mail } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function MagicLinkSignIn() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSendLink = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await authClient.signIn.magicLink({
                email,
                callbackURL: "/",
            })
            setEmailSent(true)
            toast.success("Magic link sent! Check your email (or console in dev mode).")
        } catch (error) {
            toast.error("Failed to send magic link. Please try again.")
            console.error("Magic link error:", error)
        } finally {
            setIsLoading(false)
        }
    }

    if (emailSent) {
        return (
            <div className="flex flex-col items-center gap-4 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Check your email</h3>
                    <p className="text-sm text-muted-foreground">
                        We've sent a magic link to <strong>{email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Click the link in the email to sign in.
                    </p>
                </div>
                <Button
                    variant="ghost"
                    onClick={() => {
                        setEmailSent(false)
                        setEmail("")
                    }}
                    className="mt-2"
                >
                    Use a different email
                </Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSendLink} className="flex flex-col gap-4">
            <div className="grid gap-2">
                <Label htmlFor="magic-email">Email</Label>
                <Input
                    id="magic-email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Magic Link"}
            </Button>
        </form>
    )
}
