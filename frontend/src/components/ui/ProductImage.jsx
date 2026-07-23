"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useEffect, useState } from "react";
import { getProductImageFallback, getSafeImageSrc } from "@/lib/productImage";

export default function ProductImage({
    src,
    alt,
    className = "",
    fallbackLabel,
    ...props
}) {
    const fallbackSrc = getProductImageFallback(fallbackLabel || alt || "Product");
    const [imageSrc, setImageSrc] = useState(getSafeImageSrc(src, fallbackLabel || alt));

    useEffect(() => {
        setImageSrc(getSafeImageSrc(src, fallbackLabel || alt));
    }, [src, alt, fallbackLabel]);

    return (
        <img
            {...props}
            src={imageSrc}
            alt={alt}
            className={className}
            loading={props.loading || "lazy"}
            onError={() => setImageSrc(fallbackSrc)}
        />
    );
}
