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
