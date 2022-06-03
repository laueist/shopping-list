import { useLoaderData, useOutletContext } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import type { ContextType } from "../manage-sections";
import { update } from "~/models/section.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name"));

  await update({ id, name});

  return redirect('/shopping-list/manage-sections');
};

export default function ItemPage() {
  const { item } = useOutletContext<ContextType>();

  return (
    <Form action={`/shopping-list/manage-sections/${item.id}`} method="post" className="inline">
      <input type="hidden" id="id" name="id" value={item.id} />
      <input type="text"
        name="name" id="name"
        defaultValue={item.name}
        placeholder="Section name"
        className="ml-1 border border-yellow-600 bg-white py-1 px-2"
      />
      <button type="submit" className="px-3">✅</button>
    </Form>
  );
}
