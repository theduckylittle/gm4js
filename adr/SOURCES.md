# Supported GeoMoose 4 Sources

GeoMoose3 worked to be a swiss army knife, taking any tool possible and stitching it together into a single map.
This felt like it was growing unworkable for a number of reasons:

1. WFS, if nothing else, is incredibly inconsistent depending on the provider. This hits us in a number of ways
   that may or may not be fixable:

    A. Only GML support, and the GML version matters for coordinate and projection support. This leads to chasing 
       various bugs that seem difficult to isolate and continue testing in an automated way.
    B. Projection support itself is variable depending on installation. We cannot offer users a consistnet way
       of getting data onto the map.
    C. XML parsing is slow.
    D. XML parsing is untypes. Everything in XML is a string and we need to co-erce data to fit into sortable
       tables in a sane way. This doesn't provide a great user experience.
    E. Filter support on servers varies wildly.

2. Duct-taping over inconsistent query support meant a mix of client and server side solutions that made it
   difficult to document and the maintenance of a crazy "what is supported" matrix for different data providers.

The new working theory of GeoMoose 4 is to keep the number of supported formats small, to encourage a data conversion to
formats which operate in a cloud-native manner, and strive to make the tools developed elsewhere more accessible to
"average" users looking to simply deploy a WebGIS site.

## Supporting more than just Web Mercator

OpenLayers has evolved to allow for basemaps in projections other than Web Mercator. There are issues with using
tiled datasets in maps without using Web Mercator but that is a decisions that should can be left to the administrator.
Doing a large amount of client-side reprojection is not necessarily going to bring joy to the user. To prevent that,
there should be a focus on formats which can be used in a projection agnostic way.

## How source support should move forward

To truly create a consistent experience, we should once again internalize the querying tools for GeoMoose.
Instead of worrying about writing a service or depending on a server, we can focus on the efficient modern cloud
vector formats and make that experience more consistent and efficient over time.

### Create an increased focus on GeoParquet

GeoParquet is not a transactional nor human readable format. It supports compression at rest and over the wire.
It streams very nicely and is efficient to query. GeoParquet is also a typed format eliminating the need to do
type inference on the client.

#### Coming from GeoJSON and Shapefiles

GeoMoose 4's builder-tool will convert Shapefile, GeoJSON, and GeoParquet files to GeoParquet that is supported
by the client. The "GeoParquet to GeoParquet" conversion will be a no-op/copy-only at first but it may be desirable to add
side-car files for indexes or styles in the future.

#### Other popular desktop GIS formats

QGIS and OGR have support for any number of GIS data formats used by the popular desktop GIS tools. We will lean on users
to convert their data to either GeoJSON or GeoParquet. Our project should curate a list of guides (or write our own) to
support the data conversion efforts.

### Raster support

GeoMoose 4 will continue to support the following raster services:

- XYZ raster tiles (PNG, JPEG). To support custom projections we may need to find a way to describe non-standard TileGrids.
- MapBox Vector Tiles: Despite being vector tiles these will be treated as raster an not as a queryable dataset.
- WMS-T raster tiles

Under consideration:

- WMS single-image. This should be fine but possibly not included in the demo.
