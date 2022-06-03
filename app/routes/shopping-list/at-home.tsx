import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";

import { getShoppingListItems, toggleNeedToBuy } from "~/models/shopping-list-item.server";

type LoaderData = {
  shoppingListItems: Awaited<ReturnType<typeof getShoppingListItems>>;
};

export const loader = async () => {
  return json<LoaderData>({
    shoppingListItems: await getShoppingListItems(false),
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
  const {shoppingListItems} = useLoaderData() as LoaderData;

  return (
    <div>
      {shoppingListItems.length === 0 ? (
            <p className="p-4">🚨 Uh-oh! Nothing here! Better go shopping soon.</p>
          ) : (
            <ol>
              {shoppingListItems.map((item) => (
                <li key={item.id} className="py-2">
                  {item.name}
                  &nbsp;&mdash;&nbsp;
                  <Form method="post" className="inline">
                    <input type="hidden" id="id" name="id" value={item.id} />
                    <input type="hidden" id="need_to_buy" name="need_to_buy" value={Number(!item.need_to_buy)} />
                    <button type="submit" className="text-yellow-600">Shop it!</button>
                  </Form>
                </li>
              ))}
            </ol>
          )}
    </div>
  );
}
