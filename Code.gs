/** Read-only public itinerary feed. Bind this script to the source spreadsheet, or set SPREADSHEET_ID. */
const SPREADSHEET_ID = '1p6SNy7zpJmdPjVZkHhGmpgCaLRTGewEqQOj3MS4_Anw';
const SHEET_NAME = '每日行程總覽';
const TIMEZONE = 'Asia/Bangkok';
function doGet() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const rows = ss.getSheetByName(SHEET_NAME).getRange('A8:J16').getDisplayValues();
  const days = rows.filter(r => /^2026-12-\d{2}$/.test(r[0])).map(r => ({
    date: r[0], city: r[3], theme: r[4],
    events: [
      {time:'上午', title:'上午安排', note:r[5], status:'planned', type:'activity'},
      {time:'下午', title:'下午安排', note:r[6], status:'planned', type:'activity'},
      {time:'晚上', title:'晚間安排', note:r[7], status:'planned', type:'activity'}
    ].filter(e=>e.note)
  }));
  const payload = {title:'Tomorrowland Thailand 2026｜Our Journey',updated:Utilities.formatDate(new Date(),TIMEZONE,'yyyy-MM-dd HH:mm'),timezone:TIMEZONE,days};
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
