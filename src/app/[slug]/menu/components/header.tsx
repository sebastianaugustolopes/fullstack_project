"use client";

import { Restaurant } from "@prisma/client";
import { ChevronLeftIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Corrigido para next/navigation

import { Button } from "@/components/ui/button";

interface RestaurantHeaderProps {
    restaurant: Pick<Restaurant, "coverImageUrl" | "name">;
}

const RestaurantHeader = ({ restaurant }: RestaurantHeaderProps) => {
    const router = useRouter(); // Importado do next/navigation
    const handleBAckClick = () => router.back(); // Adicionado handleBackClick

    return (
        <div className="relative h-[250px] w-full">
            <Button
                variant="secondary"
                size="icon"
                className="absolute top-4 left-4 z-50 rounded-full"
                onClick={handleBAckClick} // onClick deve ser uma prop do Button
            >
                <ChevronLeftIcon />
            </Button>
            <Image
                src={restaurant.coverImageUrl}
                alt={restaurant.name}
                fill
                className="object-cover"
            />
        </div>
    );
};

export default RestaurantHeader;