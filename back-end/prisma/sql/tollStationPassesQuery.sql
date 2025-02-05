SELECT
    ROW_NUMBER() OVER(ORDER BY "Pass"."Timestamp" ASC, "Pass"."PassID" ASC)::int AS "passIndex",
    "Pass"."PassID"::text AS "passID",
    "Pass"."Timestamp" AS "timestamp",
    "Pass"."TagRef" AS "tagID",
    ts2."Operator" AS "tagProvider",
    CASE 
        WHEN ts1."OpID" = "Pass"."TagHomeID" THEN 'home' 
        ELSE 'visitor'
    END AS "passType",
    "Pass"."Charge" AS "passCharge"
FROM "Pass" 
    LEFT OUTER JOIN "TollStation" ts1 ON "Pass"."TollId" = ts1."TollID"
    LEFT OUTER JOIN "TollStation" ts2 ON "Pass"."TagHomeID" = ts2."OpID"
WHERE "Pass"."TollId" = $1
    AND "Pass"."Timestamp" >= $2
    AND "Pass"."Timestamp" <= $3
GROUP BY ("Pass"."PassID", ts2."Operator", ts1."OpID")
ORDER BY "Pass"."Timestamp" ASC, "Pass"."PassID" ASC