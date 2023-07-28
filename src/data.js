import moment from "moment";

export const mergedCells = [
    {
        row: 0,
        col: 0,
        colspan: 2,
        rowspan: 2,
    }
]

export const columns = [
    {
        title: "lineId",
        id: "lineId",
        dataType: "Integer",
    },
    {
        title: "Id",
        id: "id",
        dataType: "Star",
        themeOverride: {
            textDark: "#009CA6",
            bgIconHeader: "#009CA6",
            accentColor: "#009CA6",
            accentLight: "#009CA620",
            fgIconHeader: "#FFFFFF",
            borderColor: "#0000FF"
        },
        custom: true,
    },
    {
        title: "Name",
        id: "name",
        dataType: "String"
    },
    {
        title: "Company",
        id: "company",
        dataType: "Code",
        custom: true,
    },
    {
        title: "ProjectFinanceLoan",
        id: "ProjectFinanceLoan",
        dataType: "String"
    },
    {
        title: "Phone",
        id: "phone",
        dataType: "String"
    },
    {
        title: "Date",
        id: "date",
        dataType: "Date",
        custom: true,
    },
];

// const createValidation = (count) => {
//     return new Array(count).fill(null).map((e) => (
//         {
//             anaCreditId: "",
//             beCrisId: "DECL_CM_006",
//             columnName: "ProjectFinanceLoan",
//             dataSet: "Instrument",
//             lineId: Math.round(Math.random() * 1000),
//             lotId: Math.round(Math.random() * 1000),
//             messageDesc: "Mandatory field missing for instrument ProjectFinanceLoan. See Declaration requirements when in",
//         }
//     ))
// }

export const validationIssue = [
    {
        anaCreditId: "",
        beCrisId: "DECL_CM_006",
        columnName: "ProjectFinanceLoan",
        dataSet: "Instrument",
        lineId: 4,
        lotId: 2113,
        messageDesc: "Mandatory field missing for instrument ProjectFinanceLoan. See Declaration requirements when in",
    },
    {
        anaCreditId: "",
        beCrisId: "DECL_CM_006",
        columnName: "ProjectFinanceLoan",
        dataSet: "Instrument",
        lineId: 5,
        lotId: 2113,
        messageDesc: "Mandatory field missing for instrument ProjectFinanceLoan. See Declaration requirements when in",
    },
    {
        anaCreditId: "",
        beCrisId: "DECL_CM_006",
        columnName: "ProjectFinanceLoan",
        dataSet: "Instrument",
        lineId: 6,
        lotId: 2113,
        messageDesc: "Mandatory field missing for instrument ProjectFinanceLoan. See Declaration requirements when in",
    },
    {
        anaCreditId: "",
        beCrisId: "DECL_CM_006",
        columnName: "ProjectFinanceLoan",
        dataSet: "Instrument",
        lineId: 7,
        lotId: 2113,
        messageDesc: "Mandatory field missing for instrument ProjectFinanceLoan. See Declaration requirements when in",
    },
    // ...createValidation(100),
]


const createData = (count) => {
    return new Array(count).fill(null).map((e) => ([
        Math.round(Math.random() * 100000).toString(),
        Math.round(Math.random() * 100000000).toString(),
        "Jean Michel",
        "Deidre Morris",
        "deidremorcom",
        "+1 (867) 332",
        moment(new Date(new Date().getTime() + Math.round(Math.random() * 100000000))).format("YYYY-MM-DD")
    ]))
}

export const data = [
    [
        "1",
        "3",
        "Jean Michel",
        "Deidre Morris",
        "deidremorcom",
        "+1 (867) 332",
        "11/11/2022AA",
    ],
    [
        "2",
        "3",
        "Sheryl Craig",
        "EVENTAGE",
        "sherylcraig@eventage.com",
        "+1 (869) 520-2227",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "3",
        "3",
        "Lidia Bowers",
        "ANOCHA",
        "lidiabowers@anocha.com",
        "+1 (808) 414-3826",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "4",
        "3",
        "Jones Norton",
        "REPETWIRE",
        "jonesnorton@repetwire.com",
        "+1 (875) 582-3320",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "5",
        "3",
        "Lula Bruce",
        "COMDOM",
        "lulabruce@comdom.com",
        "+1 (873) 452-2472",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "6",
        "3",
        "Larsen Montgomery",
        "SQUISH",
        "larsenmontgomery@squish.com",
        "+1 (893) 482-3651",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "7",
        "3",
        "Becky Bright",
        "COMCUR",
        "beckybright@comcur.com",
        "+1 (879) 494-2331",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "8",
        "3",
        "Charlotte Rowland",
        "FROLIX",
        "charlotterowland@frolix.com",
        "+1 (861) 439-2134",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "9",
        "3",
        "Sonya Hensley",
        "GEEKETRON",
        "sonyahensley@geeketron.com",
        "+1 (802) 553-2194",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "10",
        "3",
        "Stephenson Guthrie",
        "EXOSWITCH",
        "stephensonguthrie@exoswitch.com",
        "+1 (903) 449-3271",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "11",
        "3",
        "Mcmillan Cline",
        "TURNLING",
        "mcmillancline@turnling.com",
        "+1 (982) 496-2454",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "12",
        "3",
        "Kemp Davis",
        "TETRATREX",
        "kempdavis@tetratrex.com",
        "+1 (859) 594-2982",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "13",
        "3",
        "Matilda Levy",
        "SLOFAST",
        "matildalevy@slofast.com",
        "+1 (841) 521-2444",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "14",
        "3",
        "Hattie Simpson",
        "COMTRAK",
        "hattiesimpson@comtrak.com",
        "+1 (962) 587-3805",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "15",
        "3",
        "Kinney Munoz",
        "IDETICA",
        "kinneymunoz@idetica.com",
        "+1 (921) 513-2012",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "16",
        "3",
        "Lambert Raymond",
        "TURNABOUT",
        "lambertraymond@turnabout.com",
        "+1 (919) 519-2442",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    [
        "17",
        "5",
        "Bryant Dunlap",
        "BYTREX",
        "bryantdunlap@bytrex.com",
        "+1 (872) 583-2883",
        moment("11/11/2022").format("YYYY-MM-DD"),
    ],
    ...createData(10000),
]