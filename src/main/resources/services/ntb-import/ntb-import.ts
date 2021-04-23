import { Response } from "enonic-types/controller";
import { schedule } from "/lib/cron";
import { importFromNtb } from "../../lib/ntb-import";
import { context } from "../../main";

const MIME_TYPE_JSON = "application/json";

export function get(): Response {
  try {
    schedule({
      name: "import-from-ntb",
      delay: 1,
      fixedDelay: 1,
      times: 1,
      callback: () => importFromNtb(),
      context,
    });

    return {
      status: 200,
      contentType: MIME_TYPE_JSON,
      body: {
        status: "Started import",
      },
    };
  } catch (e) {
    return {
      status: 500,
      contentType: MIME_TYPE_JSON,
      body: {
        status: "Failure! " + String(e),
      },
    };
  }
}
