"use client"

import { GoogleSignIn } from "@/components/auth/google-signin"
import { MagicLinkSignIn } from "@/components/auth/magic-link-signin"
import { OAuthSignIn } from "@/components/auth/oauth-signin"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "QwkSearch";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
                            <Image
                                src="/icons/apple-touch-icon.png"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <span className="text-2xl font-bold">{APP_NAME}</span>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Sign in to continue
                        </p>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <GoogleSignIn />
                        <OAuthSignIn provider="discord" />
                        {/* <OAuthSignIn provider="facebook" /> */}
                        <OAuthSignIn provider="linkedin" />

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Or continue with email
                                </span>
                            </div>
                        </div>

                        <MagicLinkSignIn />
                    </div>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        <Link href="/" className="underline hover:text-foreground">
                            Homepage
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
