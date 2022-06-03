import type { ShoppingListItem, Section } from "@prisma/client";

import { prisma } from "~/db.server";

export async function storeNew(name: string) {
  return prisma.shoppingListItem.create({
    data: {
      name,
    },
  })
}

export async function getShoppingListItems(need_to_buy?: boolean) {
  return prisma.shoppingListItem.findMany(
    {
      where: need_to_buy !== null ? {need_to_buy} : {},
      include: { section: true },
    }
  );
}

export function toggleNeedToBuy(
  {id, need_to_buy}: Pick<ShoppingListItem, "id"> & Pick<ShoppingListItem, "need_to_buy">, 
) {

  return prisma.shoppingListItem.updateMany({
    data: { need_to_buy },
    where: { id },
  });
}

export function update(
  {id, name, sectionId}: Pick<ShoppingListItem, "id"> & Pick<ShoppingListItem, "name"> & { sectionId?: Section["id"] }, 
) {
  return prisma.shoppingListItem.updateMany({
    data: { name, sectionId },
    where: { id },
  });
}