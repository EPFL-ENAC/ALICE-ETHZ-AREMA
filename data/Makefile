version=$(shell date +%FT%H:%M)
bucket=10208-fcd9acb029f419e6493edf97f4592b96
folder=arema

help:
	@echo s3://${bucket}/${folder}/

cdn-maps:
	s3cmd put --recursive --acl-public --guess-mime-type geojson s3://${bucket}/${folder}/maps/${version}/
	s3cmd put --recursive --acl-public --guess-mime-type raster s3://${bucket}/${folder}/maps/${version}/

tif: tif-info tif-crs tif-cog

tif-info:
	gdalinfo work/${name}.tif

# convert CRS
tif-crs:
	cd work && \
	rm -f ${name}_4326.tif && \
	gdalwarp -s_srs EPSG:2056 -t_srs EPSG:4326 ${name}.tif ${name}_4326.tif -co COMPRESS=DEFLATE

# convert to COG
tif-cog:
	cd work && \
	rm -f ${name}_4326_cog.tif && \
	gdal_translate ${name}_4326.tif ${name}_4326_cog.tif -of COG -co COMPRESS=DEFLATE -co TILING_SCHEME=GoogleMapsCompatible && \
	gdalinfo ${name}_4326_cog.tif | grep -i "overviews\|byte order\|http"

tif-revert:
	cd work && \
	gdal_calc.py -A ${name}.tif --outfile=${name}_r.tif --calc="${max}-A" --NoDataValue=0

tif-nodata:
	cd work && \
	gdal_translate -a_nodata ${value} ${name}.tif ${name}_nodata.tif

cdn:
	s3cmd put --recursive --acl-public --guess-mime-type ${version} s3://${bucket}/${folder}/

sync:
	s3cmd sync s3://${bucket}/${folder}/${version}/ ${version}-local/