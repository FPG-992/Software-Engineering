#!/usr/bin/env bash

echo "se2401 healthcheck"
read -p "Press any key to resume..."
se2401 healthcheck

echo "se2401 resetpasses"
read -p "Press any key to resume..."
se2401 resetpasses

echo "se2401 healthcheck"
read -p "Press any key to resume..."
se2401 healthcheck

echo "se2401 resetstations"
read -p "Press any key to resume..."
se2401 resetstations

echo "se2401 healthcheck"
read -p "Press any key to resume..."
se2401 healthcheck

echo "se2401 admin --addpasses --source passes01.csv"
read -p "Press any key to resume..."
se2401 admin --addpasses --source passes01.csv

echo "se2401 healthcheck"
read -p "Press any key to resume..."
se2401 healthcheck

echo "se2401 tollstationpasses --station AM08 --from 20220305 --to 20220319 --format json"
read -p "Press any key to resume..."
se2401 tollstationpasses --station AM08 --from 20220305 --to 20220319 --format json

echo "se2401 tollstationpasses --station NAO04 --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 tollstationpasses --station NAO04 --from 20220305 --to 20220319 --format csv

echo "se2401 tollstationpasses --station NO01 --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 tollstationpasses --station NO01 --from 20220305 --to 20220319 --format csv

echo "se2401 tollstationpasses --station OO03 --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 tollstationpasses --station OO03 --from 20220305 --to 20220319 --format csv

echo "se2401 tollstationpasses --station XXX --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 tollstationpasses --station XXX --from 20220305 --to 20220319 --format csv

echo "se2401 tollstationpasses --station OO03 --from 20220305 --to 20220319 --format YYY"
read -p "Press any key to resume..."
se2401 tollstationpasses --station OO03 --from 20220305 --to 20220319 --format YYY

echo "se2401 errorparam --station OO03 --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 errorparam --station OO03 --from 20220305 --to 20220319 --format csv

echo "se2401 tollstationpasses --station AM08 --from 20220306 --to 20220317 --format json"
read -p "Press any key to resume..."
se2401 tollstationpasses --station AM08 --from 20220306 --to 20220317 --format json

echo "se2401 tollstationpasses --station NAO04 --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 tollstationpasses --station NAO04 --from 20220306 --to 20220317 --format csv

echo "se2401 tollstationpasses --station NO01 --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 tollstationpasses --station NO01 --from 20220306 --to 20220317 --format csv

echo "se2401 tollstationpasses --station OO03 --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 tollstationpasses --station OO03 --from 20220306 --to 20220317 --format csv

echo "se2401 tollstationpasses --station XXX --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 tollstationpasses --station XXX --from 20220306 --to 20220317 --format csv

echo "se2401 tollstationpasses --station OO03 --from 20220306 --to 20220317 --format YYY"
read -p "Press any key to resume..."
se2401 tollstationpasses --station OO03 --from 20220306 --to 20220317 --format YYY

echo "se2401 passanalysis --stationop AM --tagop NAO --from 20220305 --to 20220319 --format json"
read -p "Press any key to resume..."
se2401 passanalysis --stationop AM --tagop NAO --from 20220305 --to 20220319 --format json

echo "se2401 passanalysis --stationop NAO --tagop AM --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 passanalysis --stationop NAO --tagop AM --from 20220305 --to 20220319 --format csv

echo "se2401 passanalysis --stationop NO --tagop OO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 passanalysis --stationop NO --tagop OO --from 20220305 --to 20220319 --format csv

echo "se2401 passanalysis --stationop OO --tagop KO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 passanalysis --stationop OO --tagop KO --from 20220305 --to 20220319 --format csv

echo "se2401 passanalysis --stationop XXX --tagop KO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 passanalysis --stationop XXX --tagop KO --from 20220305 --to 20220319 --format csv

echo "se2401 passanalysis --stationop AM --tagop NAO --from 20220306 --to 20220317 --format json"
read -p "Press any key to resume..."
se2401 passanalysis --stationop AM --tagop NAO --from 20220306 --to 20220317 --format json

echo "se2401 passanalysis --stationop NAO --tagop AM --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 passanalysis --stationop NAO --tagop AM --from 20220306 --to 20220317 --format csv

echo "se2401 passanalysis --stationop NO --tagop OO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 passanalysis --stationop NO --tagop OO --from 20220306 --to 20220317 --format csv

echo "se2401 passanalysis --stationop OO --tagop KO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 passanalysis --stationop OO --tagop KO --from 20220306 --to 20220317 --format csv

echo "se2401 passanalysis --stationop XXX --tagop KO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 passanalysis --stationop XXX --tagop KO --from 20220306 --to 20220317 --format csv

echo "se2401 passescost --stationop AM --tagop NAO --from 20220305 --to 20220319 --format json"
read -p "Press any key to resume..."
se2401 passescost --stationop AM --tagop NAO --from 20220305 --to 20220319 --format json

echo "se2401 passescost --stationop NAO --tagop AM --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 passescost --stationop NAO --tagop AM --from 20220305 --to 20220319 --format csv

echo "se2401 passescost --stationop NO --tagop OO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 passescost --stationop NO --tagop OO --from 20220305 --to 20220319 --format csv

echo "se2401 passescost --stationop OO --tagop KO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 passescost --stationop OO --tagop KO --from 20220305 --to 20220319 --format csv

echo "se2401 passescost --stationop XXX --tagop KO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 passescost --stationop XXX --tagop KO --from 20220305 --to 20220319 --format csv

echo "se2401 passescost --stationop AM --tagop NAO --from 20220306 --to 20220317 --format json"
read -p "Press any key to resume..."
se2401 passescost --stationop AM --tagop NAO --from 20220306 --to 20220317 --format json

echo "se2401 passescost --stationop NAO --tagop AM --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 passescost --stationop NAO --tagop AM --from 20220306 --to 20220317 --format csv

echo "se2401 passescost --stationop NO --tagop OO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 passescost --stationop NO --tagop OO --from 20220306 --to 20220317 --format csv

echo "se2401 passescost --stationop OO --tagop KO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 passescost --stationop OO --tagop KO --from 20220306 --to 20220317 --format csv

echo "se2401 passescost --stationop XXX --tagop KO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 passescost --stationop XXX --tagop KO --from 20220306 --to 20220317 --format csv

echo "se2401 chargesby --opid NAO --from 20220305 --to 20220319 --format json"
read -p "Press any key to resume..."
se2401 chargesby --opid NAO --from 20220305 --to 20220319 --format json

echo "se2401 chargesby --opid GE --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 chargesby --opid GE --from 20220305 --to 20220319 --format csv

echo "se2401 chargesby --opid OO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 chargesby --opid OO --from 20220305 --to 20220319 --format csv

echo "se2401 chargesby --opid KO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 chargesby --opid KO --from 20220305 --to 20220319 --format csv

echo "se2401 chargesby --opid NO --from 20220305 --to 20220319 --format csv"
read -p "Press any key to resume..."
se2401 chargesby --opid NO --from 20220305 --to 20220319 --format csv

echo "se2401 chargesby --opid NAO --from 20220306 --to 20220317 --format json"
read -p "Press any key to resume..."
se2401 chargesby --opid NAO --from 20220306 --to 20220317 --format json

echo "se2401 chargesby --opid GE --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 chargesby --opid GE --from 20220306 --to 20220317 --format csv

echo "se2401 chargesby --opid OO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 chargesby --opid OO --from 20220306 --to 20220317 --format csv

echo "se2401 chargesby --opid KO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 chargesby --opid KO --from 20220306 --to 20220317 --format csv

echo "se2401 chargesby --opid NO --from 20220306 --to 20220317 --format csv"
read -p "Press any key to resume..."
se2401 chargesby --opid NO --from 20220306 --to 20220317 --format csv

echo "All commands have been executed."
echo "Press any key to exit..."