import {
  createNameSpan,
  createTippyInstance,
  tooltipHandleResponse,
} from "./helpers";
import { School, SchoolId } from "./constants";
import { RMPResponse } from "./types";
import "../css/styles.css";
import $ from "jquery";

const tableBody: JQuery = $("tr.odd, tr.even");

tableBody.each((i: number, row: HTMLElement) => {
  const namesArray: string[] = $(row)
    .find(`span[id^='u263_line']`)
    .html()
    .split("<br>");
  namesArray.pop();

  /**
   * Remove plain text names in row to replace with spans
   */
  const instructors: JQuery = $(row).find(`span[id^='u263_line']:first`);
  instructors.empty();

  namesArray.forEach((name, k) => {
    /**
     * Closure is used to preserve name index k for use in sendMessage callback
     */
    (function (k) {
      name = name.trim();
      instructors.append(createNameSpan(i, k, name));
      const instance = createTippyInstance(
        `span#instructor_row${i}_name${k}`,
        "Loading..."
      )[0];

      chrome.runtime.sendMessage(
        {
          name,
          school: School.UofT,
          schoolIds: [
            SchoolId.UofT,
            SchoolId.UofT_MISSISSAUGA,
            SchoolId.UofT_SCARBOROUGH,
            SchoolId.UofT_ST_GEORGE,
          ],
        },
        (res: RMPResponse) => {
          tooltipHandleResponse(res, instance);
        }
      );
    })(k);
  });
});
