import type { Section } from "@prisma/client";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { getSections } from "~/models/section.server";

type LoaderData = {
  sections: Awaited<ReturnType<typeof getSections>>;
  editedItemId?: Number;
};
  
export const loader = async ({ params }) => {
  return json<LoaderData>({
    sections: await getSections(),
    editedItemId: params.itemId
  });
};

export type ContextType = {
  item: Section;
};

export default function ManageItemsPage() {
    const { sections, editedItemId } = useLoaderData() as LoaderData;

    return (
      <div>
        <Form action="/shopping-list/manage-sections/create" method="post" className="inline">
          <label className="mr-2" htmlFor="select">Add a section:</label>
          <input type="text"
            name="name" id="name"
            className="ml-1 border border-yellow-600 bg-white py-1 px-2"
          />
          <button type="submit" className="ml-2 py-1 px-3 bg-yellow-600 text-white">+ Add</button>
        </Form>

        <hr className="mt-2" />

        <ol>
          {sections.map((item: Section) => (
            <li key={item.id} className="py-2">
              {
                item.id == editedItemId
                ? (
                  <Outlet context={{item}} />
                ) : (
                  <>
                    {item.name}
                    <a
                      href={`/shopping-list/manage-sections/${item.id}`}
                      className="ml-2"
                    >✏️</a>
                  </>
                )
              }
            </li>
          ))}
        </ol>
      </div>
    );
  }
  