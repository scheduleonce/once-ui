import { localStrings } from '../../../../../const/local-strings';
import { environment } from '../../../../../environments/environment';
export class LocalizationEditorToolTips {
  static DEFAULT_TOOL_TIP = `
      <div class="tooltipHeaderStandard">${
        localStrings.localizationEditor.currDefaultLocale
      }</div>
      <div class="tooltipContentStandard">
        <ul>
          <li>${localStrings.localizationEditor.automaticallyAppliedText}
            <b>${localStrings.localizationEditor.newlyCreatedPageText}</b>.
          </li>
          <li><b>${localStrings.localizationEditor.existingPageText}</b> ${
    localStrings.localizationEditor.modifyEachLocaleText
  } <a target="_blank" href="${
    localStrings.localizationEditor.helpLinks.previewTooltip
  }">
           ${
             localStrings.localizationEditor.learnMore
           }</a><img src="${environment.publicUrl +
    'assets/images/icon-tooltipLocale2x.png'}" class='infoBubbleImage'/></li>
        </ul>
        <p>
        ${localStrings.localizationEditor.switchDefaultLocaleText}
        </p>
      </div>
    `;

  static CHANGED_TOOL_TIP = `
      <div class="tooltipContentStandard">
        ${localStrings.localizationEditor.clickSetDefaultLocaleText}
        <ul>
          <li>${localStrings.localizationEditor.automaticallyAppliedText}
            <b>${localStrings.localizationEditor.newlyCreatedPageText}</b>.
          </li>
          <li><b>${localStrings.localizationEditor.existingPageText}</b> ${
    localStrings.localizationEditor.modifyEachLocaleText
  } <a target="_blank" href="${
    localStrings.localizationEditor.helpLinks.previewTooltip
  }">
            ${
              localStrings.localizationEditor.learnMore
            }</a><img src="${environment.publicUrl +
    'assets/images/icon-tooltipLocale2x.png'}" class='infoBubbleImage'/></li>
        </ul>
      </div>
    `;

  static PREVIEW_TOOL_TIP = `
     <div class="tooltipHeaderStandard">${
       localStrings.localizationEditor.previewLocaleText
     }</div>
      <div class="tooltipContentStandard">
        ${localStrings.localizationEditor.previewLocaleButtonText}
         <a href="${localStrings.localizationEditor.helpLinks.previewTooltip}"
         target="_blank">${localStrings.localizationEditor.learnMore}</a>
      </div>
    `;

  static DATE_TOOL_TIP = `
        <div class="tooltipContentStandard">
            <table>
              <tr>
                <td><b>${localStrings.localizationEditor.dddText}</b></td>
                <td>${
                  localStrings.localizationEditor.abbreviatedWeekDayText
                }</td>
              </tr>
              <tr>
                <td><b>${localStrings.localizationEditor.mmmText}</b></td>
                <td>${
                  localStrings.localizationEditor.abbreviatedMonthNameText
                }</td>
              </tr>
              <tr>
                <td><b>${
                  localStrings.localizationEditor.dropDowndayText
                }</b></td>
                <td>${localStrings.localizationEditor.dayOfMonthText}</td>
              </tr>
              <tr>
                <td><b>${localStrings.localizationEditor.yyyyText}</b></td>
                <td>${localStrings.localizationEditor.yearText}</td>
              </tr>
            </table>
          </div>
        </div>
      `;
}
