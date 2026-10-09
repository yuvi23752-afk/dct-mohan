# Project Location Setup

Project coordinates and the canonical `map_url` are stored in the `Project` table. Apply `packages/db/migrations/20261005_add_project_coordinates.sql` followed by `packages/db/migrations/20261009_project_map_url_and_decimal_coordinates.sql` before deploying the API.

Reverse geocoding uses Nominatim server-side, so no Google Maps API key is required. Set `NOMINATIM_CONTACT_EMAIL` to an address that identifies this application in the request User-Agent. Requests are serialized to no more than one per second per API process.

To backfill the three named projects, provide the correct points as JSON in `PROJECT_LOCATION_BACKFILL_JSON` and run the script from the repository root with the API environment and database connection configured:

```powershell
$env:PROJECT_LOCATION_BACKFILL_JSON = '{"DCT Valley":{"latitude":0,"longitude":0},"DCT Heights":{"latitude":0,"longitude":0},"DCT Paradise":{"latitude":0,"longitude":0}}'
npx tsx apps/api/src/scripts/backfillProjectLocations.ts
```

Replace each `0` with the correct coordinates before running. The script updates every matching project name across tenants and recalculates its location name and map URL.