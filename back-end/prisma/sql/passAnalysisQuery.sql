SELECT
    ROW_NUMBER() OVER(ORDER BY "Pass"."Timestamp" ASC, "Pass"."PassID" ASC)::int AS "passIndex",
    "Pass"."PassID"::text AS "passID",
    "Pass"."TollId" AS "stationID",
    "Pass"."Timestamp" AS "timestamp",
    "Pass"."TagRef" AS "tagID",
    "Pass"."Charge" AS "passCharge"
FROM "TollStation"
    INNER JOIN "Pass" ON "TollStation"."TollID" = "Pass"."TollId"
WHERE "TollStation"."OpID" = $1
    AND "Pass"."TagHomeID" = $2
    AND "Pass"."Timestamp" >= $3
    AND "Pass"."Timestamp" <= $4
ORDER BY "Pass"."Timestamp" ASC, "Pass"."PassID" ASC
