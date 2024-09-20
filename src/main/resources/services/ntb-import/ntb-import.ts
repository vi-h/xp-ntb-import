import { schedule } from "/lib/cron";
import { importMultipleFromNtb } from "/lib/ntb-import";
import { context } from "../../main";
import type { Response } from "@item-enonic-types/global/controller";

const MIME_TYPE_JSON = "application/json";

export function get(): Response {
  try {
    schedule({
      name: "import-from-ntb",
      delay: 1,
      fixedDelay: 1,
      times: 1,
      callback: () => importMultipleFromNtb(),
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
