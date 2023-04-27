# Data format inputs

### Natural Resource
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|Range
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|---|
| name_nr    |                     |          | `[-]`   | string  | y         ||
| zone_nr | geographic or geologic provenience    |          | `[-]`   | polygon     | y         |
| amount_nr  | approx extend of availability  |  | `[kg]`or `[m2]` or `[m3]`  |number | n         | 
| mu_nr | vapourdiffusion | mu | `[-]`   | number    |     n      ||1-inf
| lambda_nr | thermal conductivity |lambda  | `[W/m/K]`   |  number   |         n  | | 0-10
|sigma_nr| compressive strength|sigma |  `[MPa]` |number | n | |
|lca_nr| carbon footprint| |  `[kgCO2eq]` |number | n | |
|image1_nr| url| |`[-]`|image|n|
|image2_nr| url ||`[-]`|image|n|
|descr_nr| formated text||`[-]`| varchar |n|
|editor_0_nr| first editor| |  `[-]` |string | y | |
|editor_f_nr| last editor| |  `[-]` |string | y | |
|date_0_nr| date first edition| |  `[-]` |date | y | |
|date_f_nr| date last revision| |  `[-]` |date | y | |

### List of elements of a building: BE
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
| usage_bm  | which are the common uses  |  | `[-]`  |string | y         | <>BE|0-3
| mu_bm | vapourdiffusion | mu | `[-]`   | number    |     n      ||1-inf
| lambda_bm | thermal conductivity |lambda  | `[W/m/K]`   |  number   |         n  | | 0-10
|sigma_bm| compressive strength|sigma |  `[MPa]` |number | n | |
|lca_bm| carbon footprint| |  `[kgCO2eq]` |number | n | |
|image1_bm| url| |`[-]`|image|n|
|image2_bm| url ||`[-]`|image|n|
|descr_bm| formated text||`[-]`| varchar |n|
|editor_0_bm| first editor| |  `[-]` |string | y | |
|editor_f_bm| last editor| |  `[-]` |string | y | |
|date_0_bm| date first edition| |  `[-]` |date | y | |
|date_f_bm| date last revision| |  `[-]` |date | y | |

### List of professionals

architect;
civil engineer;
supplier;
craftsmen;
building physics;

### Professionals
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|
| name_pro    |                     |          | `[-]`   | string  | y         |
| adress_pro | adress of company    |          | `[-]`   | long lat     | y         |
| type_pro| drop down from list_pro| |  `[-]`  |string|y|
| expertise_pro  | expertise with which building mat  |  | `[-]`   |string | y         | <>name_bm and/or <>name_nr
|area_del_pro| area of delivery if pro=sup| |  `[-]` |polygon | n | |
|area_nr_pro| provenience of used nr if pro=sup| |  `[-]` |polygon | y | |
| web_pro | url |  | `[-]`   | string    |     n      |
| tel_pro |  |  | `[-]`   |  string   |         n  | |
|email_pro| | |  `[-]` |string | n | |
|coop_sup_pro|suppliers of pro if pro=/sup | |`[-]` | string| n | <> name_pro
|image1_pro| url| |`[-]`|image|n|
|image2_pro| url ||`[-]`|image|n|
|logo_pro| url ||`[-]`|image|n|
|descr_pro| formated text||`[-]`| varchar |n|
|editor_0_pro| first editor| |  `[-]` |string | y | |
|editor_f_pro| last editor| |  `[-]` |string | y | |
|date_0_pro| date first edition| |  `[-]` |date | y | |
|date_f_pro| date last revision| |  `[-]` |date | y | |

### Buildings
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|
| name_bui    |                     |          | `[-]`   | string  | y         |
| adress_bui | adress of building   |          | `[-]`   | long lat     | y         |
| pros_bui  | involved professionals  |  | `[-]`   |string | y         | <>name_pro
|usedbm_be1_bui|material used for building element BE1 | |`[-]` | string| n | <> name_bm
|usedbm_be15_bui|material used for building element BE15 | |`[-]` | string| n | <> name_bm
|sup_bui|suppliers of bm for building | |`[-]` | string| n | <> name_sup
|image1_bui| url| |`[-]`|image|n|
|image2_bui| url ||`[-]`|image|n|
|descr_bui| formated text||`[-]`| varchar |n|
|editor_0_bui| first editor| |  `[-]` |string | y | |
|editor_f_bui| last editor| |  `[-]` |string | y | |
|date_0_bui| date first edition| |  `[-]` |date | y | |
|date_f_bui| date last revision| |  `[-]` |date | y | |

Length of descriptive varchar <400 char for every table

------------------------

### Suppliers
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|
| name_sup    |                     |          | `[-]`   | string  | y         |
| adress_sup | adress of company    |          | `[-]`   | long lat     | y         |
| products_sup  | sells which mat  |  | `[-]`   |string | y         | <>name_bm and/or <>name_nr
| web_sup | url |  | `[-]`   | string    |     n      |
| tel_sup |  |  | `[-]`   |  string   |         n  | |
|area_del_sup| area of delivery| |  `[-]` |polygon | n | |
|area_nr_sup| provenience of used nr| |  `[-]` |polygon | y | |
|email_sup| | |  `[-]` |string | n | |
|image1_sup| url| |`[-]`|image|n|
|image2_sup| url ||`[-]`|image|n|
|logo_sup| url ||`[-]`|image|n|
|descr_sup| formated text||`[-]`| varchar |n|
|editor_0_sup| first editor| |  `[-]` |string | y | |
|editor_f_sup| last editor| |  `[-]` |string | y | |
|date_0_sup| date first edition| |  `[-]` |date | y | |
|date_f_sup| date last revision| |  `[-]` |date | y | |

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
