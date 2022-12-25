import "tippy.js/dist/tippy.css";
import "../css/styles.css";
import "tippy.js/animations/shift-toward-subtle.css";
import "../css/styles.css";
import $ from "jquery";
import tippy, { Instance } from "tippy.js";
import { RMP_TEACHER_BASE_URL, SchoolId } from "./constants";
import { ITeacherFromSearch } from "./types";

const nameTable: JQuery = $("table[class=\\table] > tbody").children();

nameTable.each((i: number, row: HTMLElement) => {
  const isTA: boolean = $(row).children().first().text().includes("TA:");
  const name: string = $(row)
    .find("td > a")
    .text()
    .replace("(Coordinator)", "");

  if (isTA || !name) {
    return false;
  }

  /**
   * Add id to each name for Tippy attachment
   */
  $(row).find("a").attr("id", `name${i}`);
  const instance = createTippyInstance(`a#name${i}`, "Loading...")[0];

  chrome.runtime.sendMessage(
    { name, schoolId: getSchoolId() },
    (res: ITeacherFromSearch[]) => {
      tooltipHandleResponse(res, instance);
    }
  );
});

/**
 * Get schoolid for Vancouver or Okanagan campus
 */
function getSchoolId(): SchoolId {
  if ($(".ubc7-campus").attr("id") === "ubc7-okanagan-campus") {
    return SchoolId.UBC_OKANAGAN;
  } else {
    return SchoolId.UBC;
  }
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
 * Create tooltip HTML from array of teacher data
 * @param {ITeacherFromSearch[]} teachers
 */
function createTooltipHTML(teachers: ITeacherFromSearch[]): string {
  let html = '<div class="scroll">';

  if (!teachers.length) {
    html = html.concat(`<span>No Rate My Professors Pages Found :(</span></br><span>Perhaps the teacher's last name is misspelled.</span></div>`);
    return html;
  }

  teachers.forEach((teacher: ITeacherFromSearch, j) => {
    const {
      firstName,
      lastName,
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
      <span>Difficulty: ${avgDifficulty != -1 ? `${avgDifficulty} / 5` : "N/A"}</span>
      <hr id="tooltipbreak">`
    );
  });
  html = html.concat("<span>Don't see your teacher's page?</span></br><span>Perhaps the teacher's last name is misspelled.</span></div>");
  return html;
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
function tooltipHandleResponse(res: ITeacherFromSearch[], instance: Instance): void {
  const html = createTooltipHTML(res);
  instance.setContent(html);
}
