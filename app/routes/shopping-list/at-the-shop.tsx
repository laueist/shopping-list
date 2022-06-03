import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import type { Section } from "@prisma/client";
import { getShoppingListItems, toggleNeedToBuy } from "~/models/shopping-list-item.server";
import { getSections } from "~/models/section.server";

type LoaderData = {
  sectionId? : number,
  sections: Awaited<ReturnType<typeof getSections>>;
  shoppingListItems: Awaited<ReturnType<typeof getShoppingListItems>>;
};

export const loader: LoaderFunction = async ({request}) => {
  const url = new URL(request.url);
  const sectionId = Number(url.searchParams.get("sectionId")) || undefined;

  return json<LoaderData>({
    sectionId: sectionId,
    sections: await getSections(),
    shoppingListItems: await getShoppingListItems(true),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  const id = Number(formData.get("id"));
  const need_to_buy = Boolean(Number(formData.get("need_to_buy")));

  await toggleNeedToBuy({ id, need_to_buy});

  return null;
};

export default function AtTheShopPage() {
  const { sectionId, sections, shoppingListItems } = useLoaderData() as LoaderData;

  const filteredItems = shoppingListItems.filter(i => sectionId === undefined || i.sectionId === sectionId);

  let submit = useSubmit();

  function applySelection(event: any) {
    submit(event.currentTarget);

    const button = window.document.getElementById('sectionFilterSubmitButton');

    button.innerHTML = 'Loading items...';
    button.disabled = true;
    
    setTimeout(() => {
      button.innerHTML = 'Apply';
      button.disabled = false;
    }, 750)
  }

  return (
    <div>
      <Form method="get" className="inline" onChange={event => applySelection(event)}>
        <label className="mr-2" htmlFor="select">Filter by section:</label>
        <select
          name="sectionId" id="sectionId"
          defaultValue={sectionId}
          className="ml-1 border border-yellow-600 bg-white py-1 px-2"
        >
          <option value="" key="null">All sections</option>
          {sections.map((section: Section) => (
            <option value={section.id} key={section.id}>{section.name}</option>
          ))}
        </select>
        <button id="sectionFilterSubmitButton" type="submit" className="ml-2 py-1 px-3 bg-yellow-600 text-white disabled:opacity-50">Apply</button>
      </Form>

      <hr className="mt-2" />

      {shoppingListItems.length === 0 ? (
        <p className="p-4">We got everything we need! 👏🏻</p>
      ) : ( 
        filteredItems.length === 0 ? (
          <p className="p-4">All clear in this section! 👏🏻</p>
        ) : (
          <ol>
            {filteredItems.map((item) => (
              <li key={item.id} className="py-2">
                {item.name}
                &nbsp;&mdash;&nbsp;
                <Form method="post" className="inline">
                  <input type="hidden" id="id" name="id" value={item.id} />
                  <input type="hidden" id="need_to_buy" name="need_to_buy" value={Number(!item.need_to_buy)} />
                  <button type="submit" className="text-yellow-600">Got it!</button>
                </Form>
              </li>
            ))}
          </ol>
        )
      )}
    </div>
  );
}
