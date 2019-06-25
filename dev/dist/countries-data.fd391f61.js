// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function(modules, cache, entry, globalName) {
    // Save the require from previous bundle to this closure if any
    var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
    var nodeRequire = typeof require === 'function' && require;

    function newRequire(name, jumped) {
        if (!cache[name]) {
            if (!modules[name]) {
                // if we cannot find the module within our internal map or
                // cache jump to the current global require ie. the last bundle
                // that was added to the page.
                var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
                if (!jumped && currentRequire) {
                    return currentRequire(name, true);
                }

                // If there are other bundles on this page the require from the
                // previous one is saved to 'previousRequire'. Repeat this as
                // many times as there are bundles until the module is found or
                // we exhaust the require chain.
                if (previousRequire) {
                    return previousRequire(name, true);
                }

                // Try the node require function if it exists.
                if (nodeRequire && typeof name === 'string') {
                    return nodeRequire(name);
                }

                var err = new Error("Cannot find module '" + name + "'");
                err.code = 'MODULE_NOT_FOUND';
                throw err;
            }

            localRequire.resolve = resolve;
            localRequire.cache = {};

            var module = (cache[name] = new newRequire.Module(name));

            modules[name][0].call(module.exports, localRequire, module, module.exports, this);
        }

        return cache[name].exports;

        function localRequire(x) {
            return newRequire(localRequire.resolve(x));
        }

        function resolve(x) {
            return modules[name][1][x] || x;
        }
    }

    function Module(moduleName) {
        this.id = moduleName;
        this.bundle = newRequire;
        this.exports = {};
    }

    newRequire.isParcelRequire = true;
    newRequire.Module = Module;
    newRequire.modules = modules;
    newRequire.cache = cache;
    newRequire.parent = previousRequire;
    newRequire.register = function(id, exports) {
        modules[id] = [
            function(require, module) {
                module.exports = exports;
            },
            {}
        ];
    };

    var error;
    for (var i = 0; i < entry.length; i++) {
        try {
            newRequire(entry[i]);
        } catch (e) {
            // Save first error but execute all entries
            if (!error) {
                error = e;
            }
        }
    }

    if (entry.length) {
        // Expose entry point to Node, AMD or browser globals
        // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
        var mainExports = newRequire(entry[entry.length - 1]);

        // CommonJS
        if (typeof exports === 'object' && typeof module !== 'undefined') {
            module.exports = mainExports;

            // RequireJS
        } else if (typeof define === 'function' && define.amd) {
            define(function() {
                return mainExports;
            });

            // <script>
        } else if (globalName) {
            this[globalName] = mainExports;
        }
    }

    // Override the current require with this new one
    parcelRequire = newRequire;

    if (error) {
        // throw error from earlier, _after updating parcelRequire_
        throw error;
    }

    return newRequire;
})(
    {
        'countries-data.js': [
            function(require, module, exports) {
                window.select2countries = [
                    {
                        name: 'United States',
                        code: 'US'
                    },
                    {
                        name: 'Mexico',
                        code: 'MX'
                    },
                    {
                        name: 'Afghanistan',
                        code: 'AF'
                    },
                    {
                        name: 'Aland Islands',
                        code: 'AX'
                    },
                    {
                        name: 'Albania',
                        code: 'AL'
                    },
                    {
                        name: 'Algeria',
                        code: 'DZ'
                    },
                    {
                        name: 'American Samoa',
                        code: 'AS'
                    },
                    {
                        name: 'Andorra',
                        code: 'AD'
                    },
                    {
                        name: 'Angola',
                        code: 'AO'
                    },
                    {
                        name: 'Anguilla',
                        code: 'AI'
                    },
                    {
                        name: 'Antarctica',
                        code: 'AQ'
                    },
                    {
                        name: 'Antigua and Barbuda',
                        code: 'AG'
                    },
                    {
                        name: 'Argentina',
                        code: 'AR'
                    },
                    {
                        name: 'Armenia',
                        code: 'AM'
                    },
                    {
                        name: 'Aruba',
                        code: 'AW'
                    },
                    {
                        name: 'Australia',
                        code: 'AU'
                    },
                    {
                        name: 'Austria',
                        code: 'AT'
                    },
                    {
                        name: 'Azerbaijan',
                        code: 'AZ'
                    },
                    {
                        name: 'Bahamas',
                        code: 'BS'
                    },
                    {
                        name: 'Bahrain',
                        code: 'BH'
                    },
                    {
                        name: 'Bangladesh',
                        code: 'BD'
                    },
                    {
                        name: 'Barbados',
                        code: 'BB'
                    },
                    {
                        name: 'Belarus',
                        code: 'BY'
                    },
                    {
                        name: 'Belgium',
                        code: 'BE'
                    },
                    {
                        name: 'Belize',
                        code: 'BZ'
                    },
                    {
                        name: 'Benin',
                        code: 'BJ'
                    },
                    {
                        name: 'Bermuda',
                        code: 'BM'
                    },
                    {
                        name: 'Bhutan',
                        code: 'BT'
                    },
                    {
                        name: 'Bolivia',
                        code: 'BO'
                    },
                    {
                        name: 'Bosnia and Herzegovina',
                        code: 'BA'
                    },
                    {
                        name: 'Botswana',
                        code: 'BW'
                    },
                    {
                        name: 'Bouvet Island',
                        code: 'BV'
                    },
                    {
                        name: 'Brazil',
                        code: 'BR'
                    },
                    {
                        name: 'British Indian Ocean Territory',
                        code: 'IO'
                    },
                    {
                        name: 'Brunei Darussalam',
                        code: 'BN'
                    },
                    {
                        name: 'Bulgaria',
                        code: 'BG'
                    },
                    {
                        name: 'Burkina Faso',
                        code: 'BF'
                    },
                    {
                        name: 'Burundi',
                        code: 'BI'
                    },
                    {
                        name: 'Cambodia',
                        code: 'KH'
                    },
                    {
                        name: 'Cameroon',
                        code: 'CM'
                    },
                    {
                        name: 'Canada',
                        code: 'CA'
                    },
                    {
                        name: 'Cape Verde',
                        code: 'CV'
                    },
                    {
                        name: 'Cayman Islands',
                        code: 'KY'
                    },
                    {
                        name: 'Central African Republic',
                        code: 'CF'
                    },
                    {
                        name: 'Chad',
                        code: 'TD'
                    },
                    {
                        name: 'Chile',
                        code: 'CL'
                    },
                    {
                        name: 'China',
                        code: 'CN'
                    },
                    {
                        name: 'Christmas Island',
                        code: 'CX'
                    },
                    {
                        name: 'Cocos (Keeling) Islands',
                        code: 'CC'
                    },
                    {
                        name: 'Colombia',
                        code: 'CO'
                    },
                    {
                        name: 'Comoros',
                        code: 'KM'
                    },
                    {
                        name: 'Congo',
                        code: 'CG'
                    },
                    {
                        name: 'Congo, The Democratic Republic of the',
                        code: 'CD'
                    },
                    {
                        name: 'Cook Islands',
                        code: 'CK'
                    },
                    {
                        name: 'Costa Rica',
                        code: 'CR'
                    },
                    {
                        name: "Cote D'Ivoire",
                        code: 'CI'
                    },
                    {
                        name: 'Croatia',
                        code: 'HR'
                    },
                    {
                        name: 'Cuba',
                        code: 'CU'
                    },
                    {
                        name: 'Cyprus',
                        code: 'CY'
                    },
                    {
                        name: 'Czech Republic',
                        code: 'CZ'
                    },
                    {
                        name: 'Denmark',
                        code: 'DK'
                    },
                    {
                        name: 'Djibouti',
                        code: 'DJ'
                    },
                    {
                        name: 'Dominica',
                        code: 'DM'
                    },
                    {
                        name: 'Dominican Republic',
                        code: 'DO'
                    },
                    {
                        name: 'Ecuador',
                        code: 'EC'
                    },
                    {
                        name: 'Egypt',
                        code: 'EG'
                    },
                    {
                        name: 'El Salvador',
                        code: 'SV'
                    },
                    {
                        name: 'Equatorial Guinea',
                        code: 'GQ'
                    },
                    {
                        name: 'Eritrea',
                        code: 'ER'
                    },
                    {
                        name: 'Estonia',
                        code: 'EE'
                    },
                    {
                        name: 'Ethiopia',
                        code: 'ET'
                    },
                    {
                        name: 'Falkland Islands (Malvinas)',
                        code: 'FK'
                    },
                    {
                        name: 'Faroe Islands',
                        code: 'FO'
                    },
                    {
                        name: 'Fiji',
                        code: 'FJ'
                    },
                    {
                        name: 'Finland',
                        code: 'FI'
                    },
                    {
                        name: 'France',
                        code: 'FR'
                    },
                    {
                        name: 'French Guiana',
                        code: 'GF'
                    },
                    {
                        name: 'French Polynesia',
                        code: 'PF'
                    },
                    {
                        name: 'French Southern Territories',
                        code: 'TF'
                    },
                    {
                        name: 'Gabon',
                        code: 'GA'
                    },
                    {
                        name: 'Gambia',
                        code: 'GM'
                    },
                    {
                        name: 'Georgia',
                        code: 'GE'
                    },
                    {
                        name: 'Germany',
                        code: 'DE'
                    },
                    {
                        name: 'Ghana',
                        code: 'GH'
                    },
                    {
                        name: 'Gibraltar',
                        code: 'GI'
                    },
                    {
                        name: 'Greece',
                        code: 'GR'
                    },
                    {
                        name: 'Greenland',
                        code: 'GL'
                    },
                    {
                        name: 'Grenada',
                        code: 'GD'
                    },
                    {
                        name: 'Guadeloupe',
                        code: 'GP'
                    },
                    {
                        name: 'Guam',
                        code: 'GU'
                    },
                    {
                        name: 'Guatemala',
                        code: 'GT'
                    },
                    {
                        name: 'Guernsey',
                        code: 'GG'
                    },
                    {
                        name: 'Guinea',
                        code: 'GN'
                    },
                    {
                        name: 'Guinea-Bissau',
                        code: 'GW'
                    },
                    {
                        name: 'Guyana',
                        code: 'GY'
                    },
                    {
                        name: 'Haiti',
                        code: 'HT'
                    },
                    {
                        name: 'Heard Island and Mcdonald Islands',
                        code: 'HM'
                    },
                    {
                        name: 'Holy See (Vatican City State)',
                        code: 'VA'
                    },
                    {
                        name: 'Honduras',
                        code: 'HN'
                    },
                    {
                        name: 'Hong Kong',
                        code: 'HK'
                    },
                    {
                        name: 'Hungary',
                        code: 'HU'
                    },
                    {
                        name: 'Iceland',
                        code: 'IS'
                    },
                    {
                        name: 'India',
                        code: 'IN'
                    },
                    {
                        name: 'Indonesia',
                        code: 'ID'
                    },
                    {
                        name: 'Iran, Islamic Republic Of',
                        code: 'IR'
                    },
                    {
                        name: 'Iraq',
                        code: 'IQ'
                    },
                    {
                        name: 'Ireland',
                        code: 'IE'
                    },
                    {
                        name: 'Isle of Man',
                        code: 'IM'
                    },
                    {
                        name: 'Israel',
                        code: 'IL'
                    },
                    {
                        name: 'Italy',
                        code: 'IT'
                    },
                    {
                        name: 'Jamaica',
                        code: 'JM'
                    },
                    {
                        name: 'Japan',
                        code: 'JP'
                    },
                    {
                        name: 'Jersey',
                        code: 'JE'
                    },
                    {
                        name: 'Jordan',
                        code: 'JO'
                    },
                    {
                        name: 'Kazakhstan',
                        code: 'KZ'
                    },
                    {
                        name: 'Kenya',
                        code: 'KE'
                    },
                    {
                        name: 'Kiribati',
                        code: 'KI'
                    },
                    {
                        name: "Korea, Democratic People'S Republic of",
                        code: 'KP'
                    },
                    {
                        name: 'Korea, Republic of',
                        code: 'KR'
                    },
                    {
                        name: 'Kuwait',
                        code: 'KW'
                    },
                    {
                        name: 'Kyrgyzstan',
                        code: 'KG'
                    },
                    {
                        name: "Lao People'S Democratic Republic",
                        code: 'LA'
                    },
                    {
                        name: 'Latvia',
                        code: 'LV'
                    },
                    {
                        name: 'Lebanon',
                        code: 'LB'
                    },
                    {
                        name: 'Lesotho',
                        code: 'LS'
                    },
                    {
                        name: 'Liberia',
                        code: 'LR'
                    },
                    {
                        name: 'Libyan Arab Jamahiriya',
                        code: 'LY'
                    },
                    {
                        name: 'Liechtenstein',
                        code: 'LI'
                    },
                    {
                        name: 'Lithuania',
                        code: 'LT'
                    },
                    {
                        name: 'Luxembourg',
                        code: 'LU'
                    },
                    {
                        name: 'Macao',
                        code: 'MO'
                    },
                    {
                        name: 'Macedonia, The Former Yugoslav Republic of',
                        code: 'MK'
                    },
                    {
                        name: 'Madagascar',
                        code: 'MG'
                    },
                    {
                        name: 'Malawi',
                        code: 'MW'
                    },
                    {
                        name: 'Malaysia',
                        code: 'MY'
                    },
                    {
                        name: 'Maldives',
                        code: 'MV'
                    },
                    {
                        name: 'Mali',
                        code: 'ML'
                    },
                    {
                        name: 'Malta',
                        code: 'MT'
                    },
                    {
                        name: 'Marshall Islands',
                        code: 'MH'
                    },
                    {
                        name: 'Martinique',
                        code: 'MQ'
                    },
                    {
                        name: 'Mauritania',
                        code: 'MR'
                    },
                    {
                        name: 'Mauritius',
                        code: 'MU'
                    },
                    {
                        name: 'Mayotte',
                        code: 'YT'
                    },
                    {
                        name: 'Micronesia, Federated States of',
                        code: 'FM'
                    },
                    {
                        name: 'Moldova, Republic of',
                        code: 'MD'
                    },
                    {
                        name: 'Monaco',
                        code: 'MC'
                    },
                    {
                        name: 'Mongolia',
                        code: 'MN'
                    },
                    {
                        name: 'Montserrat',
                        code: 'MS'
                    },
                    {
                        name: 'Morocco',
                        code: 'MA'
                    },
                    {
                        name: 'Mozambique',
                        code: 'MZ'
                    },
                    {
                        name: 'Myanmar',
                        code: 'MM'
                    },
                    {
                        name: 'Namibia',
                        code: 'NA'
                    },
                    {
                        name: 'Nauru',
                        code: 'NR'
                    },
                    {
                        name: 'Nepal',
                        code: 'NP'
                    },
                    {
                        name: 'Netherlands',
                        code: 'NL'
                    },
                    {
                        name: 'Netherlands Antilles',
                        code: 'AN'
                    },
                    {
                        name: 'New Caledonia',
                        code: 'NC'
                    },
                    {
                        name: 'New Zealand',
                        code: 'NZ'
                    },
                    {
                        name: 'Nicaragua',
                        code: 'NI'
                    },
                    {
                        name: 'Niger',
                        code: 'NE'
                    },
                    {
                        name: 'Nigeria',
                        code: 'NG'
                    },
                    {
                        name: 'Niue',
                        code: 'NU'
                    },
                    {
                        name: 'Norfolk Island',
                        code: 'NF'
                    },
                    {
                        name: 'Northern Mariana Islands',
                        code: 'MP'
                    },
                    {
                        name: 'Norway',
                        code: 'NO'
                    },
                    {
                        name: 'Oman',
                        code: 'OM'
                    },
                    {
                        name: 'Pakistan',
                        code: 'PK'
                    },
                    {
                        name: 'Palau',
                        code: 'PW'
                    },
                    {
                        name: 'Palestinian Territory, Occupied',
                        code: 'PS'
                    },
                    {
                        name: 'Panama',
                        code: 'PA'
                    },
                    {
                        name: 'Papua New Guinea',
                        code: 'PG'
                    },
                    {
                        name: 'Paraguay',
                        code: 'PY'
                    },
                    {
                        name: 'Peru',
                        code: 'PE'
                    },
                    {
                        name: 'Philippines',
                        code: 'PH'
                    },
                    {
                        name: 'Pitcairn',
                        code: 'PN'
                    },
                    {
                        name: 'Poland',
                        code: 'PL'
                    },
                    {
                        name: 'Portugal',
                        code: 'PT'
                    },
                    {
                        name: 'Puerto Rico',
                        code: 'PR'
                    },
                    {
                        name: 'Qatar',
                        code: 'QA'
                    },
                    {
                        name: 'Reunion',
                        code: 'RE'
                    },
                    {
                        name: 'Romania',
                        code: 'RO'
                    },
                    {
                        name: 'Russian Federation',
                        code: 'RU'
                    },
                    {
                        name: 'RWANDA',
                        code: 'RW'
                    },
                    {
                        name: 'Saint Helena',
                        code: 'SH'
                    },
                    {
                        name: 'Saint Kitts and Nevis',
                        code: 'KN'
                    },
                    {
                        name: 'Saint Lucia',
                        code: 'LC'
                    },
                    {
                        name: 'Saint Pierre and Miquelon',
                        code: 'PM'
                    },
                    {
                        name: 'Saint Vincent and the Grenadines',
                        code: 'VC'
                    },
                    {
                        name: 'Samoa',
                        code: 'WS'
                    },
                    {
                        name: 'San Marino',
                        code: 'SM'
                    },
                    {
                        name: 'Sao Tome and Principe',
                        code: 'ST'
                    },
                    {
                        name: 'Saudi Arabia',
                        code: 'SA'
                    },
                    {
                        name: 'Senegal',
                        code: 'SN'
                    },
                    {
                        name: 'Serbia and Montenegro',
                        code: 'CS'
                    },
                    {
                        name: 'Seychelles',
                        code: 'SC'
                    },
                    {
                        name: 'Sierra Leone',
                        code: 'SL'
                    },
                    {
                        name: 'Singapore',
                        code: 'SG'
                    },
                    {
                        name: 'Slovakia',
                        code: 'SK'
                    },
                    {
                        name: 'Slovenia',
                        code: 'SI'
                    },
                    {
                        name: 'Solomon Islands',
                        code: 'SB'
                    },
                    {
                        name: 'Somalia',
                        code: 'SO'
                    },
                    {
                        name: 'South Africa',
                        code: 'ZA'
                    },
                    {
                        name: 'South Georgia and the South Sandwich Islands',
                        code: 'GS'
                    },
                    {
                        name: 'Spain',
                        code: 'ES'
                    },
                    {
                        name: 'Sri Lanka',
                        code: 'LK'
                    },
                    {
                        name: 'Sudan',
                        code: 'SD'
                    },
                    {
                        name: 'Suriname',
                        code: 'SR'
                    },
                    {
                        name: 'Svalbard and Jan Mayen',
                        code: 'SJ'
                    },
                    {
                        name: 'Swaziland',
                        code: 'SZ'
                    },
                    {
                        name: 'Sweden',
                        code: 'SE'
                    },
                    {
                        name: 'Switzerland',
                        code: 'CH'
                    },
                    {
                        name: 'Syrian Arab Republic',
                        code: 'SY'
                    },
                    {
                        name: 'Taiwan, Province of China',
                        code: 'TW'
                    },
                    {
                        name: 'Tajikistan',
                        code: 'TJ'
                    },
                    {
                        name: 'Tanzania, United Republic of',
                        code: 'TZ'
                    },
                    {
                        name: 'Thailand',
                        code: 'TH'
                    },
                    {
                        name: 'Timor-Leste',
                        code: 'TL'
                    },
                    {
                        name: 'Togo',
                        code: 'TG'
                    },
                    {
                        name: 'Tokelau',
                        code: 'TK'
                    },
                    {
                        name: 'Tonga',
                        code: 'TO'
                    },
                    {
                        name: 'Trinidad and Tobago',
                        code: 'TT'
                    },
                    {
                        name: 'Tunisia',
                        code: 'TN'
                    },
                    {
                        name: 'Turkey',
                        code: 'TR'
                    },
                    {
                        name: 'Turkmenistan',
                        code: 'TM'
                    },
                    {
                        name: 'Turks and Caicos Islands',
                        code: 'TC'
                    },
                    {
                        name: 'Tuvalu',
                        code: 'TV'
                    },
                    {
                        name: 'Uganda',
                        code: 'UG'
                    },
                    {
                        name: 'Ukraine',
                        code: 'UA'
                    },
                    {
                        name: 'United Arab Emirates',
                        code: 'AE'
                    },
                    {
                        name: 'United Kingdom',
                        code: 'GB'
                    },
                    {
                        name: 'United States Minor Outlying Islands',
                        code: 'UM'
                    },
                    {
                        name: 'Uruguay',
                        code: 'UY'
                    },
                    {
                        name: 'Uzbekistan',
                        code: 'UZ'
                    },
                    {
                        name: 'Vanuatu',
                        code: 'VU'
                    },
                    {
                        name: 'Venezuela',
                        code: 'VE'
                    },
                    {
                        name: 'Viet Nam',
                        code: 'VN'
                    },
                    {
                        name: 'Virgin Islands, British',
                        code: 'VG'
                    },
                    {
                        name: 'Virgin Islands, U.S.',
                        code: 'VI'
                    },
                    {
                        name: 'Wallis and Futuna',
                        code: 'WF'
                    },
                    {
                        name: 'Western Sahara',
                        code: 'EH'
                    },
                    {
                        name: 'Yemen',
                        code: 'YE'
                    },
                    {
                        name: 'Zambia',
                        code: 'ZM'
                    },
                    {
                        name: 'Zimbabwe',
                        code: 'ZW'
                    }
                ];
            },
            {}
        ],
        '../node_modules/parcel-bundler/src/builtins/hmr-runtime.js': [
            function(require, module, exports) {
                var global = arguments[3];
                var OVERLAY_ID = '__parcel__error__overlay__';
                var OldModule = module.bundle.Module;

                function Module(moduleName) {
                    OldModule.call(this, moduleName);
                    this.hot = {
                        data: module.bundle.hotData,
                        _acceptCallbacks: [],
                        _disposeCallbacks: [],
                        accept: function(fn) {
                            this._acceptCallbacks.push(fn || function() {});
                        },
                        dispose: function(fn) {
                            this._disposeCallbacks.push(fn);
                        }
                    };
                    module.bundle.hotData = null;
                }

                module.bundle.Module = Module;
                var checkedAssets, assetsToAccept;
                var parent = module.bundle.parent;

                if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
                    var hostname = '' || location.hostname;
                    var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
                    var ws = new WebSocket(protocol + '://' + hostname + ':' + '57136' + '/');

                    ws.onmessage = function(event) {
                        checkedAssets = {};
                        assetsToAccept = [];
                        var data = JSON.parse(event.data);

                        if (data.type === 'update') {
                            var handled = false;
                            data.assets.forEach(function(asset) {
                                if (!asset.isNew) {
                                    var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

                                    if (didAccept) {
                                        handled = true;
                                    }
                                }
                            }); // Enable HMR for CSS by default.

                            handled =
                                handled ||
                                data.assets.every(function(asset) {
                                    return asset.type === 'css' && asset.generated.js;
                                });

                            if (handled) {
                                console.clear();
                                data.assets.forEach(function(asset) {
                                    hmrApply(global.parcelRequire, asset);
                                });
                                assetsToAccept.forEach(function(v) {
                                    hmrAcceptRun(v[0], v[1]);
                                });
                            } else {
                                window.location.reload();
                            }
                        }

                        if (data.type === 'reload') {
                            ws.close();

                            ws.onclose = function() {
                                location.reload();
                            };
                        }

                        if (data.type === 'error-resolved') {
                            console.log('[parcel] ✨ Error resolved');
                            removeErrorOverlay();
                        }

                        if (data.type === 'error') {
                            console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
                            removeErrorOverlay();
                            var overlay = createErrorOverlay(data);
                            document.body.appendChild(overlay);
                        }
                    };
                }

                function removeErrorOverlay() {
                    var overlay = document.getElementById(OVERLAY_ID);

                    if (overlay) {
                        overlay.remove();
                    }
                }

                function createErrorOverlay(data) {
                    var overlay = document.createElement('div');
                    overlay.id = OVERLAY_ID; // html encode message and stack trace

                    var message = document.createElement('div');
                    var stackTrace = document.createElement('pre');
                    message.innerText = data.error.message;
                    stackTrace.innerText = data.error.stack;
                    overlay.innerHTML =
                        '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' +
                        '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' +
                        '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' +
                        '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' +
                        message.innerHTML +
                        '</div>' +
                        '<pre>' +
                        stackTrace.innerHTML +
                        '</pre>' +
                        '</div>';
                    return overlay;
                }

                function getParents(bundle, id) {
                    var modules = bundle.modules;

                    if (!modules) {
                        return [];
                    }

                    var parents = [];
                    var k, d, dep;

                    for (k in modules) {
                        for (d in modules[k][1]) {
                            dep = modules[k][1][d];

                            if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
                                parents.push(k);
                            }
                        }
                    }

                    if (bundle.parent) {
                        parents = parents.concat(getParents(bundle.parent, id));
                    }

                    return parents;
                }

                function hmrApply(bundle, asset) {
                    var modules = bundle.modules;

                    if (!modules) {
                        return;
                    }

                    if (modules[asset.id] || !bundle.parent) {
                        var fn = new Function('require', 'module', 'exports', asset.generated.js);
                        asset.isNew = !modules[asset.id];
                        modules[asset.id] = [fn, asset.deps];
                    } else if (bundle.parent) {
                        hmrApply(bundle.parent, asset);
                    }
                }

                function hmrAcceptCheck(bundle, id) {
                    var modules = bundle.modules;

                    if (!modules) {
                        return;
                    }

                    if (!modules[id] && bundle.parent) {
                        return hmrAcceptCheck(bundle.parent, id);
                    }

                    if (checkedAssets[id]) {
                        return;
                    }

                    checkedAssets[id] = true;
                    var cached = bundle.cache[id];
                    assetsToAccept.push([bundle, id]);

                    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
                        return true;
                    }

                    return getParents(global.parcelRequire, id).some(function(id) {
                        return hmrAcceptCheck(global.parcelRequire, id);
                    });
                }

                function hmrAcceptRun(bundle, id) {
                    var cached = bundle.cache[id];
                    bundle.hotData = {};

                    if (cached) {
                        cached.hot.data = bundle.hotData;
                    }

                    if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
                        cached.hot._disposeCallbacks.forEach(function(cb) {
                            cb(bundle.hotData);
                        });
                    }

                    delete bundle.cache[id];
                    bundle(id);
                    cached = bundle.cache[id];

                    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
                        cached.hot._acceptCallbacks.forEach(function(cb) {
                            cb();
                        });

                        return true;
                    }
                }
            },
            {}
        ]
    },
    {},
    ['../node_modules/parcel-bundler/src/builtins/hmr-runtime.js', 'countries-data.js'],
    null
);
//# sourceMappingURL=/countries-data.fd391f61.js.map
