

import { BusinessDayCounter, PublicHolidays } from './calc';

describe('WeekdaysBetweenTwoDates', () => {

  const businessDayCounter = new BusinessDayCounter();
  
  test('wrong data type', () => {
    const first = new Date('2024-10-20')
    const second = 'wrong data type'
    expect(businessDayCounter.WeekdaysBetweenTwoDates(first, second as unknown as Date)).toBe(-1);
  });
  test('wrong data type 2', () => {
    const first = 'wrong data type'
    const second = new Date('2024-10-20')
    expect(businessDayCounter.WeekdaysBetweenTwoDates(first as unknown as Date, second)).toBe(-1);
  });

  test('2024-10-20 and 2014-10-20', () => {
    const first = new Date('2024-10-20')
    const second = new Date('2014-10-20')
    expect(businessDayCounter.WeekdaysBetweenTwoDates(first, second)).toBe(0);
  });

  test('2013-10-07 11:23:34 and 2013-10-09 11:23:34', () => {
    const first = new Date('2013-10-7 11:23:34')
    const second = new Date('2013-10-9 1:2:3')
    expect(businessDayCounter.WeekdaysBetweenTwoDates(first, second)).toBe(1);
  });

  test('2013-10-07 and 2013-10-09', () => {
    const first = new Date('2013-10-7')
    const second = new Date('2013-10-9')
    expect(businessDayCounter.WeekdaysBetweenTwoDates(first, second)).toBe(1);
  });
  test('2013-10-05 and 2013-10-14', () => {
    const first = new Date('2013-10-5')
    const second = new Date('2013-10-14')
    expect(businessDayCounter.WeekdaysBetweenTwoDates(first, second)).toBe(5);
  });
  test('2013-10-07 and 2014-1-1', () => {
    const first = new Date('2013-10-7')
    const second = new Date('2014-1-1')
    expect(businessDayCounter.WeekdaysBetweenTwoDates(first, second)).toBe(61);
  });
  test('2013-10-07 and 2013-10-05', () => {
    const first = new Date('2013-10-07')
    const second = new Date('2013-10-05')
    expect(businessDayCounter.WeekdaysBetweenTwoDates(first, second)).toBe(0);
  });
});


describe('BusinessDaysBetweenTwoDates', () => {

  const businessDayCounter = new BusinessDayCounter();

  const NSWPublicHoliday2013 = [
    '2013-01-01', '2013-01-28', '2013-03-29', '2013-03-30', '2013-03-31', '2013-04-01', '2013-04-25', '2013-06-10', '2013-10-07', '2013-12-25', '2013-12-26']
  
  let inputHolidays = NSWPublicHoliday2013.map(date => new Date(date))
  
  test('wrong data type', () => {
    const first = new Date('2024-10-20')
    const second = 'wrong data type'
    expect(businessDayCounter.BusinessDaysBetweenTwoDates(first, second as unknown as Date, inputHolidays)).toBe(-1);
  });
  test('wrong data type 2', () => {
    const first = 'wrong data type'
    const second = new Date('2024-10-20')
    expect(businessDayCounter.BusinessDaysBetweenTwoDates(first as unknown as Date, second, inputHolidays)).toBe(-1);
  });

  test('2024-10-20 and 2014-10-20', () => {
    const first = new Date('2024-10-20')
    const second = new Date('2014-10-20')
    expect(businessDayCounter.BusinessDaysBetweenTwoDates(first, second, inputHolidays)).toBe(0);
  });

  test('2013-10-7 11:23:34 and 2013-10-9 11:23:34', () => {
    const first = new Date('2013-10-7 11:23:34')
    const second = new Date('2013-10-9 1:2:3')
    expect(businessDayCounter.BusinessDaysBetweenTwoDates(first, second, inputHolidays)).toBe(1);
  });

  test('2013-10-7 and 2013-10-9', () => {
    const first = new Date('2013-10-7')
    const second = new Date('2013-10-9')
    expect(businessDayCounter.BusinessDaysBetweenTwoDates(first, second, inputHolidays)).toBe(1);
  });
  test('2013-12-24 and 2013-12-27', () => {
    const first = new Date('2013-12-24')
    const second = new Date('2013-12-27')
    expect(businessDayCounter.BusinessDaysBetweenTwoDates(first, second, inputHolidays)).toBe(0);
  });
  test('2013-10-7 and 2014-1-1', () => {
    const first = new Date('2013-10-7')
    const second = new Date('2014-1-1')
    expect(businessDayCounter.BusinessDaysBetweenTwoDates(first, second, inputHolidays)).toBe(59);
  });
});


describe('GeneratePublicHolidays', () => {

  const businessDayCounter = new BusinessDayCounter();

  test('Mock Fixed Date - Bob birthday', () => {
    const Mock: PublicHolidays[] = [
      {
        name: 'Bobs Birthday',
        date: ['1983-8-4'],
        holidayType: 'fixDate'
      }
    ]
    const MockHoliday = ['1983-08-04']
    expect(businessDayCounter.GeneratePublicHolidays(Mock)).toEqual(MockHoliday);
  });
  
  test('Mock WeekendExtend - Sat One day', () => {
    const Mock: PublicHolidays[] = [
      {
        name: 'Bobs Birthday',
        date: ['2013-8-3'],
        holidayType: 'weekendExtend'
      }
    ]
    const MockHoliday = ['2013-08-05']
    expect(businessDayCounter.GeneratePublicHolidays(Mock)).toEqual(MockHoliday);
  });

  test('Mock WeekendExtend - Sun One day', () => {
    const Mock: PublicHolidays[] = [
      {
        name: 'Bobs Birthday',
        date: ['2013-8-4'],
        holidayType: 'weekendExtend'
      }
    ]
    const MockHoliday = ['2013-08-05']
    expect(businessDayCounter.GeneratePublicHolidays(Mock)).toEqual(MockHoliday);
  });

  test('Mock WeekendExtend - Sat Two days successive', () => {
    const Mock: PublicHolidays[] = [
      {
        name: 'Xmas',
        date: ['2013-12-21', '2013-12-22'],
        holidayType: 'weekendExtend'
      }
    ]
    const MockHoliday = ['2013-12-23', '2013-12-24']
    expect(businessDayCounter.GeneratePublicHolidays(Mock)).toEqual(MockHoliday);
  });

  test('Mock WeekendExtend - Sun Two days successive', () => {
    const Mock: PublicHolidays[] = [
      {
        name: 'Xmas',
        date: ['2013-12-22', '2013-12-23'],
        holidayType: 'weekendExtend'
      }
    ]
    const MockHoliday = ['2013-12-24']
    expect(businessDayCounter.GeneratePublicHolidays(Mock)).toEqual(MockHoliday);
  });

  test('Mock MonthDay - 3rd Tuesday of Augest 2013', () => {
    const Mock: PublicHolidays[] = [
      {
        name: 'Pay day',
        monthDayRule: '2013|8|3|2',
        holidayType: 'monthDay'
      }
    ]
    const MockHoliday = ['2013-08-20']
    expect(businessDayCounter.GeneratePublicHolidays(Mock)).toEqual(MockHoliday);
  });


  test('NSW public holiday 2013', () => {
    const NSWHoliday2013: PublicHolidays[] = [
      {
        name: 'NewYear',
        date: ['2013-1-1'],
        holidayType: 'weekendExtend'
      },
      {
        name: 'AusDay',
        date: ['2013-1-26'],
        holidayType: 'weekendExtend'
      },
      {
        name: 'Easter',
        date: ['2013-3-29', '2013-3-30', '2013-3-31', '2013-4-1'], // Easter day seems different every year according to my research, https://en.wikipedia.org/wiki/Public_holidays_in_Australia, looks like no certain rules behind it, so I just put it as fixDate for now
        holidayType: 'fixDate'
      },
      {
        name: 'AnzacDay',
        date: ['2013-4-25'],
        holidayType: 'fixDate'
      },
      {
        name: 'KingsBirthDay',
        holidayType: 'monthDay',
        monthDayRule: '2013|6|2|1' //2013 June, 2nd Monday
      },
      {
        name: 'LabourDay',
        holidayType: 'monthDay',
        monthDayRule: '2013|10|1|1' //2013 Oct, 1st Monday
      },
      {
        name: 'Xmas',
        date: ['2013-12-25', '2013-12-26'], //Xmas and Boxing day are counted as a group, as if 25 is Sat and 26 is Sun, then following Monday and Tuesday are holiday
        holidayType: 'weekendExtend'
      }
    ]
    const NSWPublicHoliday2013Day = [
      '2013-01-01', '2013-01-28', '2013-03-29', '2013-03-30', '2013-03-31', '2013-04-01', '2013-04-25', '2013-06-10', '2013-10-07', '2013-12-25', '2013-12-26']
    expect(businessDayCounter.GeneratePublicHolidays(NSWHoliday2013)).toEqual(NSWPublicHoliday2013Day);
  });
  
});