se2401 healthcheck
se2401 resetpasses
se2401 healthcheck
se2401 resetstations
se2401 healthcheck
se2401 admin --addpasses --source passes01.csv
se2401 healthcheck
se2401 tollstationpasses --station AM08 --from 20220305 --to 20220319 --format json
se2401 tollstationpasses --station NAO04 --from 20220305 --to 20220319 --format csv
se2401 tollstationpasses --station NO01 --from 20220305 --to 20220319 --format csv
se2401 tollstationpasses --station OO03 --from 20220305 --to 20220319 --format csv
se2401 tollstationpasses --station XXX --from 20220305 --to 20220319 --format csv
se2401 tollstationpasses --station OO03 --from 20220305 --to 20220319 --format YYY
se2401 errorparam --station OO03 --from 20220305 --to 20220319 --format csv
se2401 tollstationpasses --station AM08 --from 20220306 --to 20220317 --format json
se2401 tollstationpasses --station NAO04 --from 20220306 --to 20220317 --format csv
se2401 tollstationpasses --station NO01 --from 20220306 --to 20220317 --format csv
se2401 tollstationpasses --station OO03 --from 20220306 --to 20220317 --format csv
se2401 tollstationpasses --station XXX --from 20220306 --to 20220317 --format csv
se2401 tollstationpasses --station OO03 --from 20220306 --to 20220317 --format YYY
se2401 passanalysis --stationop AM --tagop NAO --from 20220305 --to 20220319 --format json
se2401 passanalysis --stationop NAO --tagop AM --from 20220305 --to 20220319 --format csv
se2401 passanalysis --stationop NO --tagop OO --from 20220305 --to 20220319 --format csv
se2401 passanalysis --stationop OO --tagop KO --from 20220305 --to 20220319 --format csv
se2401 passanalysis --stationop XXX --tagop KO --from 20220305 --to 20220319 --format csv
se2401 passanalysis --stationop AM --tagop NAO --from 20220306 --to 20220317 --format json
se2401 passanalysis --stationop NAO --tagop AM --from 20220306 --to 20220317 --format csv
se2401 passanalysis --stationop NO --tagop OO --from 20220306 --to 20220317 --format csv
se2401 passanalysis --stationop OO --tagop KO --from 20220306 --to 20220317 --format csv
se2401 passanalysis --stationop XXX --tagop KO --from 20220306 --to 20220317 --format csv
se2401 passescost --stationop AM --tagop NAO --from 20220305 --to 20220319 --format json
se2401 passescost --stationop NAO --tagop AM --from 20220305 --to 20220319 --format csv
se2401 passescost --stationop NO --tagop OO --from 20220305 --to 20220319 --format csv
se2401 passescost --stationop OO --tagop KO --from 20220305 --to 20220319 --format csv
se2401 passescost --stationop XXX --tagop KO --from 20220305 --to 20220319 --format csv
se2401 passescost --stationop AM --tagop NAO --from 20220306 --to 20220317 --format json
se2401 passescost --stationop NAO --tagop AM --from 20220306 --to 20220317 --format csv
se2401 passescost --stationop NO --tagop OO --from 20220306 --to 20220317 --format csv
se2401 passescost --stationop OO --tagop KO --from 20220306 --to 20220317 --format csv
se2401 passescost --stationop XXX --tagop KO --from 20220306 --to 20220317 --format csv
se2401 chargesby --opid NAO --from 20220305 --to 20220319 --format json
se2401 chargesby --opid GE --from 20220305 --to 20220319 --format csv
se2401 chargesby --opid OO --from 20220305 --to 20220319 --format csv
se2401 chargesby --opid KO --from 20220305 --to 20220319 --format csv
se2401 chargesby --opid NO --from 20220305 --to 20220319 --format csv
se2401 chargesby --opid NAO --from 20220306 --to 20220317 --format json
se2401 chargesby --opid GE --from 20220306 --to 20220317 --format csv
se2401 chargesby --opid OO --from 20220306 --to 20220317 --format csv
se2401 chargesby --opid KO --from 20220306 --to 20220317 --format csv
se2401 chargesby --opid NO --from 20220306 --to 20220317 --format csv