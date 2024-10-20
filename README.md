# designCalc

## How to run

1. npm i
2. npm i -g npx (if no npx installed, you might need to add sudo for Mac)
3. npm install -g ts-node (if no ts-node installed)
4. npm run start

### How to test
1. npm run test

This test is done with TDD method, 
please find calc.spec.ts for test cases

Note:
1. Easter holiday is counted as fixed day in this calculation, as Easter holiday seems based on first full Moon after spring
2. Weekend extend holiday (public holiday falls on weekend so it extend to next monday) only covers two successive days (e.g. Xmas and Boxing day are counted as a group, as if 25 is Sat and 26 is Sun, then following Monday and Tuesday are holiday), three or more weekend extend holiday is not covered
3. MonthDayRule: '2013|6|2|1' = "2013 June, 2nd Monday", '2013|8|3|2' = '2013 Aug, 3rd Tue'

Structure:
1. WeekdaysBetweenTwoDates: basic date calculation between two days
2. BusinessDaysBetweenTwoDates: advanced date calculation between two days with filtered public holidays
2. GeneratePublicHolidays: calculate from public holiday data structure to a formatted Date[]

Environments:
1. node 19.6.0
2. jest: suggest to use watch mode: npm run test -- --watch