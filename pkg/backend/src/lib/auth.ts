// Desc: Middleware for checking if a user is authorized to access a resource
import createError from "http-errors";
import { db } from "./firebase.js";
import * as Express from "express";

async function checkUserKey(user_id: string, key: string): Promise<boolean> {
  try {
    const snapshot = await db
      .collection("users")
      .where("id", "==", user_id)
      .get();
    if (snapshot.empty) {
      return false;
    }
    for (const doc of snapshot.docs) {
      if (doc.data().apiKey === key) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function checkSiteKey(
  user_id: string,
  key: string,
  site_id: string,
): Promise<boolean> {
  try {
    const siteSnapshot = await db
      .collection("sites")
      .where("id", "==", site_id)
      .get();
    if (siteSnapshot.empty) {
      return false;
    }
    const siteDoc = siteSnapshot.docs[0];
    if (siteDoc.data().owner !== user_id) {
      return false;
    }
    const userSnapshot = await db
      .collection("users")
      .where("id", "==", user_id)
      .get();
    if (userSnapshot.empty) {
      return false;
    }
    const userDoc = userSnapshot.docs[0];
    if (userDoc.data().apiKey !== key) {
      return false;
    }
    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function checkKeyValid(
  user_id: string,
  key: string,
  site_id: string | null = null,
): Promise<boolean> {
  if (site_id === null) {
    const res = await checkUserKey(user_id, key);
    return res;
  } else {
    const res = await checkSiteKey(user_id, key, site_id);
    return res;
  }
}

function checker(
  req: Express.Request,
  res: Express.Response,
  next: Express.NextFunction,
): any {
  const headers = req.headers;
  const apiKey = Array.isArray(headers["x-api-key"])
    ? headers["x-api-key"][0]
    : headers["x-api-key"];
  const userId = Array.isArray(headers["x-user"])
    ? headers["x-user"][0]
    : headers["x-user"];
  if (!apiKey || !userId) {
    return next(createError(401, "unauthorized"));
  }
  switch (req.method) {
    case "GET":
      if (!checkKeyValid(userId, apiKey)) {
        return next(createError(401, "unauthorized"));
      }
      break;
    default:
      if (!checkKeyValid(userId, apiKey, req.params.site_id as string)) {
        return next(createError(401, "unauthorized"));
      }
      break;
  }
  return next();
}

export { checker };
