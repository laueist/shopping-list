import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { storeNew } from "~/models/section.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("name");

  await storeNew(name);

  return redirect('/shopping-list/manage-sections');
};

export default function CreateSectionPage() {}
