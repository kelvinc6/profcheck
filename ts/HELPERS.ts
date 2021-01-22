function createNameSpan(rowIndex: number, nameIndex: number, name: string) {
  return jQuery.parseHTML(
    `<span id="instructor_row${rowIndex}_name${nameIndex}">${name}</span></br>`
  );
}

function createTooltip(selector: string, text: string): void {
  //@ts-ignore
  tippy(selector, {
    content: text,
    allowHTML: true,
    interactive: true,
    placement: "right",
  });
}

function createTooltipEntriesHTML(teachers: RMPTeacherData[]) {
  let html = "";
  teachers.forEach((teacher, j) => {
    const firstName = teacher.teacherfirstname_t;
    const lastName = teacher.teacherlastname_t;
    const department = teacher.teacherdepartment_s;
    const rating = teacher.averageratingscore_rf;
    const linkHTML = `<a style="color:DeepSkyBlue;" href="${
      RMP_TEACHER_BASE_URL + teacher.pk_id
    }" target="_blank">RMP Page</a>`;
    html = html.concat(
      
      `${firstName} ${lastName} </br> Department: ${department} </br> Rating: ${rating} </br> ${linkHTML}`
    );

    if (j < teachers.length - 1) {
      html = html.concat("<hr>");
    }
  });
  return html
}
