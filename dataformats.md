# Data format inputs

### Natural Ressource
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|Range
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|---|
| name_nr    |                     |          | `[-]`   | string  | y         ||
| zone_nr | geographic or geologic provenience    |          | `[-]`   | polygon     | y         |
| amount_nr  | approx extend of availability  |  | `[kg]`or `[m2]` or `[m3]`  |number | n         | 
| mu_nr | vapourdiffusion | mu | `[-]`   | number    |     n      ||1-inf
| lambda_nr | thermal conductivity |lambda  | `[W/m/K]`   |  number   |         n  | | 0-10
|sigma_nr| compressive strength|sigma |  `[MPa]` |number | n | |

### List of elements of a building
foundation;
floor load-bearing;
floor non-load-bearing;
wall exterior load-bearing;
wall exterior non-load-bearing;
wall interior load-bearing;
wall interior non-load-bearing;
windows;
doors;
structural;
roof;
insulation exterior;
insulation interior;
cladding interior;
cladding exterior

### Building Material
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|Range
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|---|
| name_bm    |                     |          | `[-]`   | string  | y         ||
| constituant_bm | principal constituants   |          | `[-]`   | string     | y         |<>name_nr| 0-3
| usage_bm  | which are the common uses  |  | `[-]`  |string | y         | <>builelem|0-3
| mu_bm | vapourdiffusion | mu | `[-]`   | number    |     n      ||1-inf
| lambda_bm | thermal conductivity |lambda  | `[W/m/K]`   |  number   |         n  | | 0-10
|sigma_bm| compressive strength|sigma |  `[MPa]` |number | n | |
|lca_bm| carbon footprint| |  `[kgCO2eq]` |number | n | |

### Professionals
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|
| name_pro    |                     |          | `[-]`   | string  | y         |
| adress_pro | adress of company    |          | `[-]`   | long lat     | y         |
| expertise_pro  | expertise with which building mat  |  | `[-]`   |string | y         | <>name_bm and/or <>name_nr
| web_pro | url |  | `[-]`   | string    |     n      |
| tel_pro |  |  | `[-]`   |  string   |         n  | |
|email_pro| | |  `[-]` |string | n | |
|coop_sup_pro|suppliers of pro | |`[-]` | string| n | <> name_sup
|image1_pro| url| |`[-]`|image|n|
|image2_pro| url ||`[-]`|image|n|
|logo_pro| url ||`[-]`|image|n|
|descr_pro| formated text||`[-]`| varchar |n|

Length of descriptive varchar <400 char for every table





Composed of 2 files :
- one json file containing parameters reserved for the software
- one csv file with data
 ## JSON files standards :
Encoding format: UTF-8
```javascript
[
	{
		"stress_ratio": double, // Stress ratio (R) [-]
		"confidence_interval": double, // confidence bounds, usually 5, 95% (rsql) [-]
		"a": double, // S-N Curve parameter [-]
		"b": double, // S-N Curve parameter [1/MPa]
		"lrsq": double, // [?], optional
		"fp": double, // Fp Linearity criterion [?], optional
	},
	...
]
```
## CSV files standards (column names must be exact) :
Encoding format: UTF-8, Separator: ',' (comma)
