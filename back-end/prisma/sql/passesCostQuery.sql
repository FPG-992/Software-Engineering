WITH
    "TollOpTollStations" AS (
        SELECT *
        FROM "TollStation"
        WHERE "OpID" = $1
    ),
    "TagOpPasses" AS (
        SELECT *
        FROM "Pass"
        WHERE "TagHomeID" = $2
            AND "Timestamp" >= $3
            AND "Timestamp" <= $4
    )
SELECT
    "TollOpTollStations"."OpID" AS "tollOpID",
    "TagOpPasses"."TagHomeID" AS "tagOpID",
    COUNT(*)::int AS "nPasses",
    COALESCE(SUM("TagOpPasses"."Charge"), 0) AS "passesCost"
FROM "TagOpPasses"
    INNER JOIN "TollOpTollStations" ON "TagOpPasses"."TollId" = "TollOpTollStations"."TollID"
GROUP BY ("TollOpTollStations"."OpID", "TagOpPasses"."TagHomeID")


-- This is an equivalent query but because "JOIN" happens
-- before any "WHERE" filtering, the above query is faster
-- since it will try to join two already filtered tables

-- SELECT
--     "TollStation"."OpID" AS "tollOpID",
--     "Pass"."TagHomeID" AS "tagOpID",
--     COUNT(*) AS "nPasses",
--     SUM("Pass"."Charge") AS "passesCost"
-- FROM "Pass"
--     INNER JOIN "TollStation" ON "Pass"."TollId" = "TollStation"."TollID"
-- WHERE "TollStation"."OpID" = $1
--     AND "Pass"."TagHomeID" = $2
-- GROUP BY ("TollStation"."OpID", "Pass"."TagHomeID")


