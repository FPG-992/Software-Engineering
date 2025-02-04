export const paramDateFormat = "yyyyMMdd";

export const responseDateFormat = "yyyy-MM-dd HH:mm";


export const passRowColumns = Object.freeze([
	"timestamp",
	"tollID",
	"tagRef",
	"tagHomeID",
	"charge",
]);

export const tollStationRowColumns = Object.freeze([
	"OpID",
	"Operator",
	"TollID",
	"Name",
	"PM",
	"Locality",
	"Road",
	"Lat",
	"Long",
	"Email",
	"Price1",
	"Price2",
	"Price3",
	"Price4"
])

export default {
	paramDateFormat,
	responseDateFormat,
	passRowColumns,
	tollStationRowColumns,
}
