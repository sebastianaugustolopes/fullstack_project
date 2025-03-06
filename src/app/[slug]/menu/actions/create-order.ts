"use server";

import { ConsumptionMethod } from "@prisma/client";
import { redirect } from "next/navigation"; // Importação correta

import { db } from "@/lib/prisma";

import { removeCpfPunctuation } from "../helpers/cpf";

interface CreateOrderInput {
    customerName: string;
    customerCpf: string;
    products: Array<{
        id: string;
        quantity: number;
    }>;
    consumptionMethod: ConsumptionMethod;
    slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
    const restaurant = await db.restaurant.findUnique({
        where: {
            slug: input.slug, // Certifique-se de que o slug está sendo usado corretamente
        },
    });

    if (!restaurant) {
        throw new Error("Restaurante não encontrado.");
    }

    const productsWithPrices = await db.product.findMany({
        where: {
            id: {
                in: input.products.map((product) => product.id),
            },
        },
    });

    const productsWithPricesAndQuantities = input.products.map((product) => ({
        productId: product.id,
        quantity: product.quantity,
        price: productsWithPrices.find((p) => p.id === product.id)!.price,
    }));

    await db.order.create({
        data: {
            status: "PENDING",
            customerName: input.customerName,
            customerCPF: removeCpfPunctuation(input.customerCpf),
            orderProducts: {
                createMany: {
                    data: productsWithPricesAndQuantities,
                },
            },
            total: productsWithPricesAndQuantities.reduce(
                (acc, product) => acc + product.price * product.quantity,
                0,
            ),
            consumptionMethod: input.consumptionMethod,
            restaurantId: restaurant.id, // Certifique-se de que o ID do restaurante está sendo usado corretamente
        },
    });

    // Redireciona para a página de pedidos
    redirect(`/${input.slug}/orders?cpf=${removeCpfPunctuation(input.customerCpf)}`);
};