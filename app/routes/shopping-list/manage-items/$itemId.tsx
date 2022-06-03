import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { getSections } from "~/models/section.server";
import { Form } from "@remix-run/react";
import type { Section } from "@prisma/client";
import type { ContextType } from "../manage-items";
import { update } from "~/models/shopping-list-item.server";

type LoaderData = {
  sections: Awaited<ReturnType<typeof getSections>>;
};

export const loader = async () => {
  return json<LoaderData>({
    sections: await getSections(),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const id = Number(formData.get("id"));
  const name = String(formData.get("name"));
  const sectionId = Number(formData.get("section_id")) || undefined;

  await update({ id, name, sectionId});

  return redirect('/shopping-list/manage-items');
};

export default function ItemPage() {
  const { sections } = useLoaderData() as LoaderData;
  const { item } = useOutletContext<ContextType>();

  return (
    <Form action={`/shopping-list/manage-items/${item.id}`} method="post" className="inline">
      <input type="hidden" id="id" name="id" value={item.id} />
      <input type="text"
        name="name" id="name"
        defaultValue={item.name}
        placeholder="Item name"
        className="ml-1 border border-yellow-600 bg-white py-1 px-2"
      />
      &nbsp;&mdash;&nbsp;
      <select
        name="section_id" id="section_id"
        defaultValue={item.sectionId}
        className="border border-yellow-600 bg-white py-1 px-2"
      >
        <option value="" key="null">(please choose a section)</option>
        {sections.map((section: Section) => (
          <option value={section.id} key={section.id}>{section.name}</option>
        ))}
      </select>
      <button type="submit" className="px-3">✅</button>
    </Form>
  );
}
