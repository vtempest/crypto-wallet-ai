"use client";

import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface FooterLink {
    url: string;
    text: string;
    icon?: string;
}

interface FooterProps {
    listFooterLinks?: FooterLink[];
    optionShowIcons?: boolean;
    optionBackgroundColor?: string;
    optionColumns?: number;
}

/**
 * Footer component that displays a list of links with optional icons
 * @param listFooterLinks - Array of footer links with their properties
 * @param optionShowIcons - Whether to show icons next to links (default: true)
 * @param optionBackgroundColor - Background color class for the footer (default: "bg-black/40")
 */
export default function Footer({
    listFooterLinks = [],
    optionShowIcons = true,
    optionBackgroundColor = "bg-black/40",
    optionColumns = 3,
}: FooterProps) {
    return (
        <div
            className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-200 text-xs z-20 ${optionBackgroundColor} rounded-lg px-2 py-1 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-wrap items-center justify-center gap-x-6 max-w-[90vw]`}
        >
            <div className={`max-w-4xl mx-auto grid grid-cols-3 gap-2`}>
                {listFooterLinks.map(({ url, text, icon }) => {
                    const IconComponent = icon
                        ? (LucideIcons[icon as keyof typeof LucideIcons] as LucideIcon)
                        : null;

                    const isExternal = url.startsWith("http");
                    const linkProps = isExternal
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {};

                    const content = (
                        <>
                            {optionShowIcons && IconComponent && (
                                <IconComponent size={14} />
                            )}
                            <span
                                className="font-semibold tracking-wide text-md"
                                style={{ fontVariant: "small-caps" }}
                            >
                                {text}
                            </span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-current transition-all duration-300 group-hover:w-full group-hover:shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                        </>
                    );

                    return isExternal ? (
                        <a
                            key={url}
                            href={url}
                            {...linkProps}
                            className="relative group inline-flex items-center gap-1 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300 whitespace-nowrap"
                        >
                            {content}
                        </a>
                    ) : (
                        <Link
                            key={url}
                            href={url}
                            className="relative group inline-flex items-center gap-1 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transition-all duration-300 whitespace-nowrap"
                        >
                            {content}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

// Example usage with default links
export const defaultFooterLinks: FooterLink[] = [
    { url: "https://airesearch.js.org/docs/functions", text: "Docs", icon: "HelpCircle" },
    // { url: "/pricing", text: "Pricing", icon: "DollarSign" },
    { url: "https://www.linkedin.com/company/qwksearch/posts/", text: "Blog", icon: "Newspaper" },
    { url: "https://discord.gg/SJdBqBz3tV", text: "Support", icon: "MessageCircle" },
    { url: "/legal/privacy", text: "Privacy", icon: "Lock" },
    { url: "https://rights.institute", text: "Ethics", icon: "Bot" },
    { url: "/custom", text: "Enterprise", icon: "Building2" },
];