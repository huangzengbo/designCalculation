
export interface PublicHolidays {
  name: string,
  holidayType: 'fixDate' | 'weekendExtend' | 'monthDay',
  date?: string[],
  monthDayRule?: string
}

export class BusinessDayCounter {
  isValidDate(input: unknown): boolean {
    if ((input instanceof Date) && !isNaN(input as unknown as number)) {
      return true
    }
    return false
  }

  isDayIncludesDays(day: Date, days: Date[]): boolean {

    for (const eachDay of days) {
      const eachDayString = `${eachDay.getFullYear()}-${eachDay.getMonth() + 1}-${eachDay.getDate()}`
      const dayString = `${day.getFullYear()}-${day.getMonth() + 1}-${day.getDate()}`

      if (eachDayString === dayString) {
        return true
      }
    }
    return false
  }

  addDays(input: Date, days: number): Date {
    const returnDate = new Date(new Date(input).getTime()+(days*24*60*60*1000))
    return returnDate
  } 

  daysBetweenDates(firstDate: Date, secondDate: Date, publicHolidays: Date[]) {
    if (!this.isValidDate(firstDate) || !this.isValidDate(secondDate)) {
      // different error type, ideally function return value should be "number | Error"
      return -1
    }

    if (firstDate > secondDate) {
      // different error type, ideally function return value should be "number | Error", or we can swap 1st and 2nd date
      return 0
    }

    // date could be something like 2024-10-20 16:53:39, this is to make sure date is 2024-10-20 only, without hour, minute, second
    let first = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate())
    const second = new Date(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate())
    let days = 0

    first = this.addDays(first, 1)

    while (first < second) {
      if ((first.getDay() !== (0)) && (first.getDay() !== 6) && (!this.isDayIncludesDays(first, publicHolidays))) {
        days++
      }

      first = this.addDays(first, 1)
    }
    
    return days
  }

  addZeroDayString(input: string): string {

    if (input.split('-').length < 2) {
      return ''
    }
    const year = input.split('-')[0]
    const month = input.split('-')[1]
    const day = input.split('-')[2]
    const resultDateString = `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`
    return resultDateString
  }

  dateToString(input: Date): string {
    return `${input.getFullYear()}-${input.getMonth() + 1}-${input.getDate()}`
  }

  GeneratePublicHolidays(publicHolidays: PublicHolidays[]): string[] {
    let resultPublicHolidays: string[] = []
    for (const eachPublicHoliday of publicHolidays) {
      if (eachPublicHoliday.holidayType === 'fixDate') {
        
        if (eachPublicHoliday?.date && eachPublicHoliday.date.length > 0) {
          for (const eachDay of eachPublicHoliday.date) {
            resultPublicHolidays.push(this.addZeroDayString(eachDay))
          }
        }
        
      }

      if (eachPublicHoliday.holidayType === 'weekendExtend') {
        if (eachPublicHoliday?.date && eachPublicHoliday.date.length > 0) {

          if (eachPublicHoliday.date.length === 1) {
            const eachDayDate = new Date(eachPublicHoliday.date[0])
            if ((eachDayDate.getDay() !== (0)) && (eachDayDate.getDay() !== 6)) {
              resultPublicHolidays.push(this.addZeroDayString(eachPublicHoliday.date[0]))
            }
            if (eachDayDate.getDay() === 6) {
              const SatToMon = this.addDays(eachDayDate,2)
              resultPublicHolidays.push(this.addZeroDayString(this.dateToString(SatToMon)))
            }
            if (eachDayDate.getDay() === 0) {
              const SunToMon = this.addDays(eachDayDate,1)
              resultPublicHolidays.push(this.addZeroDayString(this.dateToString(SunToMon)))
            }
          }

          if (eachPublicHoliday.date.length === 2) {
            const eachDayDate = new Date(eachPublicHoliday.date[0])
            if (eachDayDate.getDay() === 5) {
              const FriToMon = this.addDays(eachDayDate,3)
              resultPublicHolidays.push(this.addZeroDayString(this.dateToString(FriToMon)))
            } else if (eachDayDate.getDay() === 6) {
              const SatToMon = this.addDays(eachDayDate,2)
              resultPublicHolidays.push(this.addZeroDayString(this.dateToString(SatToMon)))
              const SatToTue = this.addDays(eachDayDate,3)
              resultPublicHolidays.push(this.addZeroDayString(this.dateToString(SatToTue)))
            } else if (eachDayDate.getDay() === 0) {
              const SunToTue = this.addDays(eachDayDate,2)
              resultPublicHolidays.push(this.addZeroDayString(this.dateToString(SunToTue)))
            } else {
              resultPublicHolidays.push(this.addZeroDayString(eachPublicHoliday.date[0]))
              resultPublicHolidays.push(this.addZeroDayString(eachPublicHoliday.date[1]))
            }
          }
          
        }
      }

      if (eachPublicHoliday.holidayType === 'monthDay') {
        
        if (eachPublicHoliday?.monthDayRule) {
          const year = Number(eachPublicHoliday.monthDayRule.split('|')[0])
          const month = Number(eachPublicHoliday.monthDayRule.split('|')[1])
          const numberof = Number(eachPublicHoliday.monthDayRule.split('|')[2])
          const day = Number(eachPublicHoliday.monthDayRule.split('|')[3])

          const start = new Date(`${year}-${month}-1`)
          const end = this.addDays(new Date(`${year}-${month + 1}-1`), -1)
          let loop = new Date(start)
          let matchNumberOf = 0

          while (loop <= end) {
            if (loop.getDay() === day) {
              matchNumberOf++
            }
            if (matchNumberOf === numberof) {
              resultPublicHolidays.push(this.addZeroDayString(this.dateToString(loop)))
              break
            }
            loop = this.addDays(loop, 1)
          }
        }
        
      }
    }
    return resultPublicHolidays
  }

  WeekdaysBetweenTwoDates(firstDate: Date, secondDate: Date): number {
    return this.daysBetweenDates(firstDate, secondDate, [])
  }

  BusinessDaysBetweenTwoDates(
    firstDate: Date,
    secondDate: Date,
    publicHolidays: Date[],
  ): number {
    return this.daysBetweenDates(firstDate, secondDate, publicHolidays)
  }
}


const calc = new BusinessDayCounter()
const first = new Date('2013-10-7')
const second = new Date('2014-1-1')

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

const generatedNSWPublicHolidays = calc.GeneratePublicHolidays(NSWHoliday2013)
const inputHolidays = generatedNSWPublicHolidays.map(date => new Date(date))

const weekdays = calc.WeekdaysBetweenTwoDates(first, second)
const weekdaysNoPub = calc.BusinessDaysBetweenTwoDates(first, second, inputHolidays)

console.log(weekdays, weekdaysNoPub)