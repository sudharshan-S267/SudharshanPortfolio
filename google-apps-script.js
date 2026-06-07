/**
 * Paste this in Google Apps Script (Extensions → Apps Script)
 * Then: Deploy → New deployment → Web app → Anyone
 */

const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'Responses';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    if (SPREADSHEET_ID === 'PASTE_YOUR_SPREADSHEET_ID_HERE') {
      throw new Error('Set your SPREADSHEET_ID in Apps Script');
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getSheets()[0];
    }

    const params = e.parameter || {};
    const name = params.name || '';
    const email = params.email || '';
    const message = params.message || '';

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message']);
    }

    sheet.appendRow([new Date(), name, email, message]);

    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, message: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'Portfolio form endpoint is active.' })
  ).setMimeType(ContentService.MimeType.JSON);
}
