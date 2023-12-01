export interface ProfileInfo {
  organizations: Organization[];
  homeIcons: HomeIcon[];
  regionalSettings: RegionalSettings;
  profiles: Profile;
}

export interface HomeIcon {
  id: number;
  Name: string;
}

export interface Organization {
  id: number;
  value: string;
}

export interface Profile {
  user: User;
  group: Group;
}

export interface Group {
  timesheet: NameValue[];
}

export interface NameValue {
  name: string;
  value: string;
}

export interface User {
  general: NameValue[];
  timesheet: NameValue[];
}

export interface RegionalSettings {
  shortDateFormat: string;
}

// JSON that is used to convert
//{
//    "organizations":[
//        {
//        "id": 1,
//            "value": "Test Organization"
//        }
//    ],
//    "homeIcons": [
//        {
//        "id": 1,
//            "Name": "Calendar"
//        }
//    ],
//    "regionalSettings": {
//        "shortDateFormat": ""
//    },
//    "profiles":{
//        "user":{
//            "general": [
//                {
//                "name": "one",
//                    "value": "two"
//                }
//                ],
//             "timesheet": [
//                {
//                "name": "one",
//                    "value": "two"
//                }
//            ]
//        },
//        "group": {
//            "timesheet": [
//                {
//                "name": "one",
//                    "value": "two"
//                }
//            ]
//        }
//    }

//}
