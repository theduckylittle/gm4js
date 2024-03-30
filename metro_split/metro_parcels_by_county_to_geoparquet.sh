wget "https://resources.gisdata.mn.gov/pub/gdrs/data/pub/us_mn_state_metrogis/plan_regonal_parcels_2023/fgdb_plan_regonal_parcels_2023.zip"

unzip fgdb_plan_regonal_parcels_2023.zip

ogrinfo plan_regonal_parcels_2023.gdb -sql 'ALTER TABLE Parcels2023Anoka DROP COLUMN PRIN_MER'
ogrinfo plan_regonal_parcels_2023.gdb -sql 'ALTER TABLE Parcels2023Carver DROP COLUMN PRIN_MER'
ogrinfo plan_regonal_parcels_2023.gdb -sql 'ALTER TABLE Parcels2023Dakota DROP COLUMN PRIN_MER'
ogrinfo plan_regonal_parcels_2023.gdb -sql 'ALTER TABLE Parcels2023Hennepin DROP COLUMN PRIN_MER'
ogrinfo plan_regonal_parcels_2023.gdb -sql 'ALTER TABLE Parcels2023Ramsey DROP COLUMN PRIN_MER'
ogrinfo plan_regonal_parcels_2023.gdb -sql 'ALTER TABLE Parcels2023Scott DROP COLUMN PRIN_MER'
ogrinfo plan_regonal_parcels_2023.gdb -sql 'ALTER TABLE Parcels2023Washington DROP COLUMN PRIN_MER'
ogrinfo plan_regonal_parcels_2023.gdb -sql 'ALTER TABLE Parcles2023Anoka DROP COLUMN PRIN_MER'


ogr2ogr -f Parquet -t_srs EPSG:4326 \
        Parcels2023Anoka.geoparquet \
        plan_regonal_parcels_2023.gdb \
        -nlt CONVERT_TO_LINEAR \
        Parcels2023Anoka

ogr2ogr -f Parquet -t_srs EPSG:4326 \
        Parcels2023Carver.geoparquet \
        plan_regonal_parcels_2023.gdb \
        -nlt CONVERT_TO_LINEAR \
        Parcels2023Carver

ogr2ogr -f Parquet -t_srs EPSG:4326 \
        Parcels2023Dakota.geoparquet \
        plan_regonal_parcels_2023.gdb \
        -nlt CONVERT_TO_LINEAR \
        Parcels2023Dakota

ogr2ogr -f Parquet -t_srs EPSG:4326 \
        Parcels2023Hennepin.geoparquet \
        plan_regonal_parcels_2023.gdb \
        -nlt CONVERT_TO_LINEAR \
        Parcels2023Hennepin

ogr2ogr -f Parquet -t_srs EPSG:4326 \
        Parcels2023Ramsey.geoparquet \
        plan_regonal_parcels_2023.gdb \
        -nlt CONVERT_TO_LINEAR \
        Parcels2023Ramsey

ogr2ogr -f Parquet -t_srs EPSG:4326 \
        Parcels2023Scott.geoparquet \
        plan_regonal_parcels_2023.gdb \
        -nlt CONVERT_TO_LINEAR \
        Parcels2023Scott

ogr2ogr -f Parquet -t_srs EPSG:4326 \
        Parcels2023Washington.geoparquet \
        plan_regonal_parcels_2023.gdb \
        -nlt CONVERT_TO_LINEAR \
        Parcels2023Washington
