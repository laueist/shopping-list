import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useLocation } from "@remix-run/react";
import { getShoppingListItems, toggleNeedToBuy } from "~/models/shopping-list-item.server";
import SectionFilter from "~/components/SectionFilter"
import { getSections } from "~/models/section.server";
import { redirect } from "@remix-run/server-runtime";

type LoaderData = {
  sectionId? : number,
  sections: Awaited<ReturnType<typeof getSections>>;
  shoppingListItems: Awaited<ReturnType<typeof getShoppingListItems>>;
};

export const loader: LoaderFunction = async ({request}) => {
  const url = new URL(request.url);
  const sectionId = Number(url.searchParams.get("sectionId")) || undefined;

  return json<LoaderData>({
    sectionId,
    sections: await getSections(),
    shoppingListItems: await getShoppingListItems(true),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  switch (formData.get('action-type')) {
    case "put-item-in-cart":
      const id = Number(formData.get("id"));
      const need_to_buy = Boolean(Number(formData.get("need_to_buy")));

      await toggleNeedToBuy({ id, need_to_buy});

      break;

    case "filter-by-section":
      const url = new URL(request.url);
      url.searchParams.set('sectionId', formData.get("sectionId"));

      return redirect(url);
  }

  return null;
};

export default function AtTheShopPage() {
  const { sectionId, sections, shoppingListItems } = useLoaderData() as LoaderData;

  const filteredItems = shoppingListItems.filter(i => sectionId === undefined || i.sectionId === sectionId);

  let location = useLocation();

  return (
    <div>
      <SectionFilter sectionId={sectionId} sections={sections} />

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
                <Form action={location.pathname+location.search} method="post" className="inline">
                  <input type="hidden" id="action-type" name="action-type" value="put-item-in-cart" />
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
