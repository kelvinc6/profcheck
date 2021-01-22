import tippy, { createSingleton, Instance, Tippy } from "tippy.js";
import "tippy.js/dist/tippy.css";
import "../css/styles.css";
import "tippy.js/animations/shift-toward-subtle.css";

import { RMP_TEACHER_BASE_URL, RMP_ADD_TEACHER_URL } from "./constants";
import { RMPTeacherData } from "./d";
var $ = require("jquery");

function createNameSpan(rowIndex: number, nameIndex: number, name: string) {
  return $.parseHTML(
    `<span id="instructor_row${rowIndex}_name${nameIndex}">${name}</span></br>`
  );
}

function createTooltip(selector: string, text: string) {
  return tippy(selector, {
    content: text,
    theme: "custom",
    allowHTML: true,
    interactive: true,
    offset: [0, 15],
    placement: "right",
    animation: "shift-toward-subtle",
  });
}

function createTippySingleton(tippys: Instance[]) {
  createSingleton(tippys, {
    interactiveBorder: 32,
    moveTransition: "transform 0.2s fade",
    overrides: [
      "allowHTML",
      "interactive",
      "interactiveBorder",
      "placement",
      "animation",
      "theme",
      "offset",
    ],
  });
}

function createTooltipHTML(teachers: RMPTeacherData[]) {
  let html = "";
  teachers.forEach((teacher, j) => {
    const firstName = teacher.teacherfirstname_t;
    const lastName = teacher.teacherlastname_t;
    const school = teacher.schoolname_s;
    const department = teacher.teacherdepartment_s;
    const rating = teacher.averageratingscore_rf;
    const numRatings = teacher.total_number_of_ratings_i;
    const linkHTML = `<a style="color:DeepSkyBlue;" href="${
      RMP_TEACHER_BASE_URL + teacher.pk_id
    }" target="_blank">RMP Page</a>`;
    html = html.concat(
      `<div><span><b>${firstName} ${lastName}</b></span></br><span>School: ${school}</span></br><span>Department: ${department}</span></br><span>Rating: ${
        rating ? `${rating} / 5 (${numRatings} ratings)` : "N/A"
      } </span></br><span>${linkHTML}</span></div>`
    );

    if (j < teachers.length - 1) {
      html = html.concat(`<hr id="tooltipbreak">`);
    }
  });
  return html;
}

function createTooltipNoResultsHTML() {
  return `<span>No Rate My Professor's Pages Found :(</span></br><a style="color:DeepSkyBlue;" href="${RMP_ADD_TEACHER_URL}" target="_blank">Add RMP Page</a>`;
}

export {
  createNameSpan,
  createTooltip,
  createTooltipHTML,
  createTooltipNoResultsHTML,
  createTippySingleton,
};