"use client";
import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const LanguageSelector = () => {
    const locale = useLocale();
    const t = useTranslations('HomePage.navbar');
    const [isPending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleChange = (value: string) => {
        startTransition(() => {
            // Close dropdown before triggering refresh to avoid portal cleanup race
            setOpen(false);
            document.cookie = `locale=${value}; path=/; max-age=${60 * 60 * 24 * 365}`;
            // Allow Radix portal to unmount cleanly before refresh
            setTimeout(() => {
                // Soft refresh so Server Components re-read cookies
                // Using replace to same path ensures re-render
                router.replace(pathname);
                router.refresh();
            }, 50);
        });
    };

    return (
        <div className="min-w-[6rem]">
            <Select value={locale} onValueChange={handleChange} disabled={isPending} open={open} onOpenChange={setOpen}>
                <SelectTrigger>
                    <SelectValue placeholder={t('languagePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ur">اردو</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
export default LanguageSelector;