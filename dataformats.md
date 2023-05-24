# Data format inputs

### Natural Resource
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|Range
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|---|
| name_nr    |                     |          | `[-]`   | string  | y         ||
| zone_nr | geographic or geologic provenience    |          | `[-]`   | polygon     | y         | list de zones (polygones obligatoires)
| amount_nr  | approx extend of availability  |  | `[kg]`or `[m2]` or `[m3]`  |number | n         | 
| mu_nr | vapourdiffusion | mu | `[-]`   | number    |     n      ||1-inf
| lambda_nr | thermal conductivity |lambda  | `[W/m/K]`   |  number   |         n  | | 0-10
|sigma_nr| compressive strength|sigma |  `[MPa]` |number | n | | |R+
|lca_nr| carbon footprint| |  `[kgCO2eq]` |number | n | | [-inf, +inf]

|image1_nr| url| |`[-]`|image|n|
|image2_nr| url ||`[-]`|image|n|
|descr_nr| formated text||`[-]`| varchar |n|

|editor_0_nr| first editor| |  `[-]` |string | y | |
|editor_f_nr| last editor| |  `[-]` |string | y | |
|date_0_nr| date first edition| |  `[-]` |date | y | |
|date_f_nr| date last revision| |  `[-]` |date | y | |

### List of elements of a building: BE
Use a unique id in case we want to change the name of the building element
be1,be2,...


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
| constituant_bm | principal constituants   |          | `[-]`   | string     | y         | <>name_nr  | [1,3]
| usage_bm  | which are the common uses  |  | `[-]`              |string      | y         | <>BE       | no limit 
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

### List of Technical constructions
- Combination of BE and BM
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|Range
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|---|
| bm | building material   |          | `[-]`   | string     | y         |name_bm| 1
| be | building element   |          | `[-]`   | string     | y         |name_be| 1
| image          | url| |`[-]`|images|n| (max 10MB)

E.g

foundation_stone

### Types of professionals

architect;
civil engineer;
supplier;
craftsmen;
building physics;
supplier;
association;
construction firms;
dealer;

### Professionals
| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|
| name_pro    |                     |          | `[-]`   | string  | y         |
| adress_pro | adress of company    |          | `[-]`   | string     | y         |
| type_pro| drop down from list_pro| |  `[-]`  |string|y|
| expertise_pro  | expertise with which building mat  |  | `[-]`   |string | y         | <>name_bm and/or <>name_nr   --> { zone seulement (polygones) pour natural resource}
| area_del_pro| area of delivery if pro=sup| |  `[-]` |polygon | n | | radius + coordinate (make two fields)
| web_pro | url |  | `[-]`   | string    |     n      |
| tel_pro |  |  | `[-]`   |  string   |         n  | |
|email_pro| | |  `[-]` |string | n | |
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
| pros_bui  | involved professionals  |  | `[-]`   |string | y         | <> name_pro[]

	technical_constructions = ["be1_grey", "be1_wood", "be1_stone",...........]
|usedbm_be1_bui  | material used for building element BE1 | |`[-]` | string| n | <> name_bm
|usedbm_be15_bui | material used for building element BE15 | |`[-]` | string| n | <> name_bm


|sup_bui|suppliers of bm for building | |`[-]` | string| n | <> name_sup [1,]

|image1_bui| url| |`[-]`|image|n|
|image2_bui| url ||`[-]`|image|n|

|descr_bui| formated text||`[-]`| varchar |n|

|editor_0_bui| first editor| |  `[-]` |string | y | |
|editor_f_bui| last editor| |  `[-]` |string | y | |
|date_0_bui| date first edition| |  `[-]` |date | y | |
|date_f_bui| date last revision| |  `[-]` |date | y | |

Length of descriptive varchar <400 char for every table
------------------------
