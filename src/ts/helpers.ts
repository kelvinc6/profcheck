import tippy, { createSingleton, Instance } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "../css/styles.css";
import "tippy.js/animations/shift-toward-subtle.css";

import { RMP_TEACHER_BASE_URL } from "./constants";
import { RMPResponse, ITeacherPage } from "./types";
import $ from "jquery";

/**
 * Creates a span element with a name. Used for substituting plain text names on UofT's course explorer
 * @param {number} rowIndex
 * @param {number} nameIndex - index of name within a row (multiple names can appear in a row)
 * @param {string} name
 */
function createNameSpan(
  rowIndex: number,
  nameIndex: number,
  name: string
): JQuery.Node[] {
  return $.parseHTML(
    `<span id="instructor_row${rowIndex}_name${nameIndex}">${name}</span></br>`
  );
}

/**
 * Create a Tippy tooltip on the selected element
 * @param {string} selector
 * @param {string} html
 */
function createTippyInstance(selector: string, html: string): Instance[] {
  return tippy(selector, {
    content: html,
    theme: "dark",
    allowHTML: true,
    interactiveBorder: 6,
    interactive: true,
    offset: [0, 15],
    placement: "right",
    animation: "shift-toward-subtle",
  });
}

/**
 * Combines all Tippy instances using the singleton pattern
 * @param {Instance[]} tippys
 * @deprecated
 */
function createTippySingleton(tippys: Instance[]) {
  createSingleton(tippys, {
    inlinePositioning: true,
    overrides: [
      "allowHTML",
      "interactive",
      "interactiveBorder",
      "placement",
      "animation",
      "theme",
      "offset",
      "moveTransition",
    ],
  });
}

/**
 * Create tooltip HTML from array of teacher data
 * @param {ITeacherPage[]} teachers
 */
function createTooltipHTML(teachers: ITeacherPage[]): string {
  let html = '<div class="scroll">';
  teachers.forEach((teacher: ITeacherPage, j) => {
    const {
      firstName,
      lastName,
      school,
      department,
      avgRating,
      numRatings,
      avgDifficulty,
      legacyId,
    } = teacher;

    RMP_TEACHER_BASE_URL.searchParams.set("tid", legacyId.toString());

    html = html.concat(
      `<span><a id="tooltiplink" href="${RMP_TEACHER_BASE_URL}" target="_blank"><b>${firstName} ${lastName}</b></a></span></br>
      <span>Department: ${department}</span></br>
      <span>Rating: ${avgRating != -1 ? `${avgRating} / 5 (${numRatings} ratings)` : `N/A (${numRatings} ratings)`} </span></br>
      <span>Difficulty: ${
        avgDifficulty != -1 ? `${avgDifficulty} / 5` : "N/A"
      }</span>`
    );

    if (j < teachers.length - 1) {
      html = html.concat(`<hr id="tooltipbreak">`);
    }
    html.concat("<\div>");
  });
  return html;
}

/**
 * Create tooltip HTML when search failed
 */
function createTooltipNoResultsHTML(): string {
  return `<span>No Rate My Professors Pages Found :(</span></br><span>Perhaps the teacher's last name is misspelled.</span>`;
}

/**
 * Create tooltip HTML when search threw an error
 */
function createTooltipErrorHTML(): string {
  return `<span>An error occurred when fetching data :(</span>`;
}

/**
 * Sets the content of a Tippy depending on response
 * @param {RMPResponse} res - RMPResponse from query
 * @param {Instance} instance - Tippy instance
 */
function tooltipHandleResponse(res: RMPResponse, instance: Instance): void {
  const docs: ITeacherPage[] = res.docs;
  const error: Error | undefined = res.error;

  if (docs.length != 0) {
    console.log("Setting content!");
    const html = createTooltipHTML(docs);
    instance.setContent(html);
  } else if (error) {
    instance.setContent(createTooltipErrorHTML());
  } else {
    instance.setContent(createTooltipNoResultsHTML());
  }
}

export {
  createNameSpan,
  createTippyInstance,
  createTooltipHTML,
  createTooltipNoResultsHTML,
  createTooltipErrorHTML,
  tooltipHandleResponse,
};
