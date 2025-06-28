'use client'

import type { Banner } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

// This is a simplified version of the banner data for preview purposes
// as it comes directly from the form state.
// We Omit the date types from the original Banner type and add them back as Date objects
// to match the type coming from the react-hook-form state.
type BannerPreviewData = Omit<Partial<Banner>, 'startDate' | 'endDate'> & {
    title?: string;
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundColor?: string;
    textColor?: string;
    clickableImage?: boolean;
    startDate?: Date;
    endDate?: Date;
}

const BannerPreview = ({ banner }: { banner: BannerPreviewData }) => {
    const {
        title,
        subtitle,
        description,
        imageUrl,
        buttonText,
        buttonLink,
        backgroundColor = '#ffffff',
        textColor = '#000000',
        clickableImage = false,
    } = banner;

    const bannerContent = (
        <div className="relative z-10 p-8 md:p-12 text-center flex flex-col items-center justify-center h-full">
            {title && <h2 className="text-4xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{title}</h2>}
            {subtitle && <h3 className="text-2xl mt-2">{subtitle}</h3>}
            {description && <p className="mt-4 max-w-xl text-lg">{description}</p>}
            {buttonText && buttonLink && (
                <Button
                    asChild={!clickableImage}
                    className="mt-6 rounded-none tracking-widest font-semibold px-8 py-3 h-auto"
                    style={{
                        backgroundColor: textColor,
                        color: backgroundColor,
                        borderColor: textColor
                    }}
                    variant="default"
                >
                    {/* We use a span for the asChild case to avoid nested links, and a Link otherwise */}
                    {clickableImage ? <span>{buttonText}</span> : <Link href="#">{buttonText}</Link>}
                </Button>
            )}
        </div>
    );

    const isValidImageUrl = imageUrl && (imageUrl.startsWith('/') || imageUrl.startsWith('http'));

    return (
        <div
            className="relative w-full aspect-[16/6] overflow-hidden rounded-lg border flex items-center justify-center"
            style={{ backgroundColor: backgroundColor, color: textColor }}
        >
            {isValidImageUrl && (
                <Image
                    src={imageUrl}
                    alt={title || 'Banner image preview'}
                    fill
                    className="object-cover object-top opacity-30"
                />
            )}
            <div className="absolute inset-0 bg-black/10" />

            {clickableImage && buttonLink ? (
                <Link href="#" className="w-full h-full" tabIndex={-1}>
                    {bannerContent}
                </Link>
            ) : (
                bannerContent
            )}
        </div>
    )
}

export default BannerPreview;
