import type { ShoppingListItem } from "@prisma/client";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { getShoppingListItems } from "~/models/shopping-list-item.server";

type LoaderData = {
  shoppingListItems: Awaited<ReturnType<typeof getShoppingListItems>>;
  editedItemId?: Number;
};
  
export const loader = async ({ params }) => {
  return json<LoaderData>({
    shoppingListItems: await getShoppingListItems(),
    editedItemId: params.itemId
  });
};

export type ContextType = {
  item: ShoppingListItem;
};

export default function ManageItemsPage() {
    const { shoppingListItems, editedItemId } = useLoaderData() as LoaderData;

    return (
      <div>
        <Form action="/shopping-list/manage-items/create" method="post" className="inline">
          <label className="mr-2" htmlFor="select">Add an item:</label>
          <input type="text"
            name="name" id="name"
            className="ml-1 border border-yellow-600 bg-white py-1 px-2"
          />
          <button type="submit" className="ml-2 py-1 px-3 bg-yellow-600 text-white">+ Add</button>
        </Form>

        <hr className="mt-2" />

        <ol>
          {shoppingListItems.map((item) => (
            <li key={item.id} className="py-2">
              {
                item.id == editedItemId
                ? (
                  <Outlet context={{item}} />
                ) : (
                  <>
                    {item.name}
                    &nbsp;&mdash;&nbsp;
                    {item.section?.name || '(no section)'}
                    <a
                      href={`/shopping-list/manage-items/${item.id}`}
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
  