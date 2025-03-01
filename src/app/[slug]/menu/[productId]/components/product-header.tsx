"use client";

import { Product } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

interface ProductHeaderProps {
    product: Pick<Product, "imageUrl" | "name">;
}

const ProductHeader = ({product}: ProductHeaderProps) => {
    const router = useRouter();
    const handleBack = () => router.back();
    return (
        <div className="relative w-full min-h-[300px]">
        <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 left-4 z-50 rounded-full"
                onClick={handleBack}
            >
                <ChevronLeftIcon />
            </Button>
            <Image src={product.imageUrl} alt={product.name} fill objectFit="contain" />
            <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 right-4 z-50 rounded-full"
            >
                <ScrollTextIcon/>
            </Button>
        </div>
      );
}
 
export default ProductHeader;