WITH 
    "TollOpTollStations" AS (
        SELECT *
        FROM "TollStation"
        WHERE "OpID" = $1
    ),
    "PassesDateFiltered" AS (
        SELECT *
        FROM "Pass"
        WHERE "Timestamp" >= $2
            AND "Timestamp" <= $3
    ),
    "OtherOpIDs" AS (
        SELECT DISTINCT "OpID"
        FROM "TollStation"
        WHERE "OpID" != $1
    )
SELECT 
    "OtherOpIDs"."OpID" AS "visitingOpID",
    -- COUNT(*) counts all regardles of their values which we don't want,
    -- but if we COUNT("PassID") it will only count the non-null values
    -- and those with null values mean that there are no passes for that specific
    -- visiting operator
    COUNT("PassesDateFiltered"."PassID")::int AS "nPasses",
    COALESCE(SUM("PassesDateFiltered"."Charge"), 0::numeric(19,2)) AS "passesCost"
FROM "TollOpTollStations"
    CROSS JOIN "OtherOpIDs"
    LEFT OUTER JOIN "PassesDateFiltered" ON "OtherOpIDs"."OpID" = "PassesDateFiltered"."TagHomeID"
GROUP BY ("OtherOpIDs"."OpID")