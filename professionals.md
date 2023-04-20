# Data format inputs "Professionals"
/*
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
*/
## CSV files standards (column names must be exact) :

Encoding format: UTF-8, Separator: ',' (comma)

| Variable name     | Description                     | Symbol    | Unit    | Data type | Mandatory |Reference|
| ----------------- | ------------------------------- | --------- | ------- | --------- | --------- |---|
| name_pro    |                     |          | `[-]`   | string  | y         |
| adress_pro | adress of company    |          | `[-]`   | long lat     | y         |
| expertise_pro  | expertise with which building mat  |  | `[-]`   |string | y         | <>name_nm
| web_pro | url |  | `[-]`   | string    |     n      |
| tel_pro |  |  | `[-]`   |  string   |         n  | |
|email_pro| | |  `[-]` |string | n | |
|coop_sup_pro|suppliers of pro | |`[-]` | string| n | <> name_sup
