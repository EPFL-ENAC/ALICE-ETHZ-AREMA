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