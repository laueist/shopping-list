import type { Section } from "@prisma/client";
import { prisma } from "~/db.server";

export async function storeNew(name: string) {
  return prisma.section.create({
    data: {
      name,
    },
  })
}

export async function getSections() {
  return prisma.section.findMany();
}

export function update(
  {id, name}: Pick<Section, "id"> & Pick<Section, "name">, 
) {
  return prisma.section.updateMany({
    data: { name },
    where: { id },
  });
}