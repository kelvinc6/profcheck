import { Instance } from "tippy.js";
import {
  createNameSpan,
  createTooltip,
  createTooltipHTML,
  createTooltipNoResultsHTML,
  createTooltipErrorHTML,
} from "./helpers";
import { SchoolId } from "./constants";
import { RMPTeacherData, RMPResponse } from "./d";
import "../css/styles.css";
import $ from "jquery";

const tableBody: JQuery = $("tbody[role=alert]").children();

let tippyInstances: Instance[] = [];

tableBody.each((i: number, row: HTMLElement) => {
  const namesArray: string[] = $(row)
    .find(`span[id^='u263_line']`)
    .html()
    .trim()
    .split("<br>");
  namesArray.pop();

  /**
   * Remove plain text names in row to replace with spans
   */
  const instructors: JQuery = $(row).find(`div[id^='u263_line']`);
  instructors.empty();

  namesArray.forEach((name, k) => {
    /**
     * Closure is used to preserve name index k for use in sendMessage callback
     */
    (function (k) {
      instructors.append(createNameSpan(i, k, name));
      const instance = createTooltip(
        `span#instructor_row${i}_name${k}`,
        "Loading..."
      )[0];

      tippyInstances.push(instance);

      chrome.runtime.sendMessage(
        {
          schoolIds: [
            SchoolId.UofT,
            SchoolId.UofT_MISSISSAUGA,
            SchoolId.UofT_SCARBOROUGH,
            SchoolId.UofT_ST_GEORGE,
          ],
          name,
        },
        (res: RMPResponse) => {
          const numFound = res.numFound;
          const docs: RMPTeacherData[] = res.docs;
          const error: Error | undefined = res.error;

          if (numFound != 0) {
            const html = createTooltipHTML(docs);
            instance.setContent(html);
          } else if (error) {
            instance.setContent(createTooltipErrorHTML());
          } else {
            instance.setContent(createTooltipNoResultsHTML());
          }
        }
      );
    })(k);
  });
});
