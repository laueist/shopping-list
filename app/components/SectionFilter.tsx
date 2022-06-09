import { useState } from "react";
import { Form, useLocation, useTransition, useSubmit } from "@remix-run/react";
import type { Section } from "@prisma/client";

export default function SectionFilter({ sectionId, sections }) {
  const [onTimeout, setOnTimeout] = useState(false);

  let submit = useSubmit();

  function applySelection(event: any) {
    submit(event.currentTarget);

    setOnTimeout(true);
    
    setTimeout(() => {
      setOnTimeout(false);
      }, 750)
  }

  const transition = useTransition();

  const inTransition = ["submitting", "loading"].includes(transition.state) && transition.submission?.formData.get('action-type') === 'filter-by-section' || onTimeout;

  const submitButtonText =
    inTransition
      ? "Loading items..."
      : "Apply";

  let location = useLocation();

  return (
      <Form action={location.pathname+location.search} method="post" className="inline" onChange={event => applySelection(event)}>
        <label className="mr-2" htmlFor="sectionId">Filter by section:</label>
        <input type="hidden" id="action-type" name="action-type" value="filter-by-section" />
        <select
          name="sectionId" id="sectionId"
          defaultValue={sectionId}
          className="ml-1 border border-yellow-600 bg-white py-1 px-2"
        >
          <option value="" key="null">All sections</option>
          {sections && sections.map((section: Section) => (
            <option value={section.id} key={section.id}>{section.name}</option>
          ))}
        </select>
        <button type="submit" className="ml-2 py-1 px-3 bg-yellow-600 text-white disabled:opacity-50" disabled={inTransition}>{submitButtonText}</button>
      </Form>
  )
}