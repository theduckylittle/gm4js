wget "https://resources.gisdata.mn.gov/pub/gdrs/data/pub/us_mn_state_metrogis/plan_regonal_parcels_2023/fgdb_plan_regonal_parcels_2023.zip"

unzip fgdb_plan_regonal_parcels_2023.zip

ogr2ogr -f GPKG out.gpkg plan_regonal_parcels_2023.gdb \
	-nlt CONVERT_TO_LINEAR \
	-nln Parcels2023 \
	-sql "select shape, county_pin from Parcels2023Anoka"

ogr2ogr -append -f GPKG out.gpkg plan_regonal_parcels_2023.gdb \
	-nlt CONVERT_TO_LINEAR \
	-nln Parcels2023 \
	-sql "select shape, county_pin from Parcels2023Carver"

ogr2ogr -append -f GPKG out.gpkg plan_regonal_parcels_2023.gdb \
	-nlt CONVERT_TO_LINEAR \
	-nln Parcels2023 \
	-sql "select shape, county_pin from Parcels2023Dakota"

ogr2ogr -append -f GPKG out.gpkg plan_regonal_parcels_2023.gdb \
	-nlt CONVERT_TO_LINEAR \
	-nln Parcels2023 \
	-sql "select shape, county_pin from Parcels2023Hennepin"

ogr2ogr -append -f GPKG out.gpkg plan_regonal_parcels_2023.gdb \
	-nlt CONVERT_TO_LINEAR \
	-nln Parcels2023 \
	-sql "select shape, county_pin from Parcels2023Ramsey"

ogr2ogr -append -f GPKG out.gpkg plan_regonal_parcels_2023.gdb \
	-nlt CONVERT_TO_LINEAR \
	-nln Parcels2023 \
	-sql "select shape, county_pin from Parcels2023Scott"

ogr2ogr -append -f GPKG out.gpkg plan_regonal_parcels_2023.gdb \
	-nlt CONVERT_TO_LINEAR \
	-nln Parcels2023 \
	-sql "select shape, county_pin from Parcels2023Washington"

ogr2ogr -f Parquet -t_srs EPSG:4326 Parcels2023.geoparquet out.gpkg Parcels2023
