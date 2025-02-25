import { notFound } from "next/navigation";

import { db } from "@/lib/prisma";

import RestaurantHeader from "./components/header";

interface RestaurantMenuPageProps {
    params: { slug: string };
    searchParams: { [key: string]: string | undefined }; // Aceita qualquer parâmetro de consulta
}

const isConsumptionMethodValid = (consumptionMethod: string | undefined) => {
    // Valores válidos: "DINE_IN" ou "TAKEWAY"
    return consumptionMethod && ["DINE_IN", "TAKEWAY"].includes(consumptionMethod.toUpperCase())
        ? consumptionMethod
        : notFound();
};

const RestaurantMenuPage = async ({ params, searchParams }: RestaurantMenuPageProps) => {
    const { slug } = params;

    // Normaliza o nome do parâmetro para minúsculas
    const normalizedSearchParams = Object.fromEntries(
        Object.entries(searchParams).map(([key, value]) => [key.toLowerCase(), value])
    );

    // Verifica se o parâmetro "consumptionmethod" é válido
    const consumptionMethod = isConsumptionMethodValid(normalizedSearchParams.consumptionmethod);

    const restaurant = await db.restaurant.findUnique({ where: { slug } });

    if (!restaurant) {
        return notFound();
    }

    return (
        <div>
            <RestaurantHeader restaurant={restaurant} />
        </div>
    );
};

export default RestaurantMenuPage;