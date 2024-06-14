import { Injectable } from '@nestjs/common';
import moment from 'moment';
import {
  ENUM_HELPER_DATE_DIFF,
  ENUM_HELPER_DATE_FORMAT,
} from 'src/common/helper/constants/helper.enum.constant';
import { IHelperDateService } from 'src/common/helper/interfaces/helper.date-service.interface';
import {
  IHelperDateExtractDate,
  IHelperDateOptionsBackward,
  IHelperDateOptionsCreate,
  IHelperDateOptionsDiff,
  IHelperDateOptionsFormat,
  IHelperDateOptionsForward,
  IHelperDateOptionsRoundDown,
  IHelperDateStartAndEnd,
  IHelperDateStartAndEndDate,
} from 'src/common/helper/interfaces/helper.interface';

@Injectable()
export class HelperDateService implements IHelperDateService {
  calculateAge(dateOfBirth: Date): number {
    return moment().diff(dateOfBirth, 'years');
  }

  /**
   * This function calculate the difference between two input dates dateOne and dateTwoMoreThanDateOne
   * The function then checks if an options object is passed in and if it contains a format property.
   * If it does, it checks the value of that property against a set of predefined
   * constants and returns the difference in the specified format.
   * If no options are passed in, it defaults to returning the difference in days.
   * @param dateOne
   * @param dateTwoMoreThanDateOne
   * @param options
   */
  diff(
    dateOne: Date,
    dateTwoMoreThanDateOne: Date,
    options?: IHelperDateOptionsDiff,
  ): number {
    const mDateOne = moment(dateOne);
    const mDateTwo = moment(dateTwoMoreThanDateOne);
    const diff = moment.duration(mDateTwo.diff(mDateOne));

    if (options?.format === ENUM_HELPER_DATE_DIFF.MILIS) {
      return diff.asMilliseconds();
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.SECONDS) {
      return diff.asSeconds();
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.HOURS) {
      return diff.asHours();
    } else if (options?.format === ENUM_HELPER_DATE_DIFF.MINUTES) {
      return diff.asMinutes();
    } else {
      return diff.asDays();
    }
  }

  /**
   * This function check if the input date is a valid date.
   * It first creates a Moment object from the input date,
   * passing in true as the second argument to the moment() function.
   *
   * let date = "2022-11-01";
   * let result = check(date);
   * console.log(result);
   * In this example, result would be true, because the date is in valid format.
   * @param date
   */
  check(date: string | Date | number): boolean {
    return moment(date, true).isValid();
  }

  /**
   * This function  check if the input timestamp is a valid timestamp.
   *
   * let timestamp = 1612118400;
   * let result = checkTimestamp(timestamp);
   * console.log(result);
   * In this example, result would be true, because the timestamp is a valid timestamp.
   * @param timestamp
   */
  checkTimestamp(timestamp: number): boolean {
    return moment(timestamp, true).isValid();
  }

  /**
   * This function create a new Date object from the input date.
   * If no input date is provided, the function defaults to creating a new Date object for
   * the current date and time.
   * It then checks if an options object is passed in and if it contains a startOfDay property.
   * If it does, it calls the startOf() function on the moment object and sets
   * the time to the start of the day.
   *
   * let date = "2022-11-01";
   * let result = create(date, { startOfDay: true });
   * console.log(result);
   * In this example, result would be a Date object set to the start of the day "2022-11-01".
   * @param date
   * @param options
   */
  create(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate,
  ): Date {
    const mDate = moment(date ?? undefined);

    if (options?.startOfDay) {
      mDate.startOf('day');
    }

    return mDate.toDate();
  }

  /**
   * This function  create a timestamp from the input date.
   * If no input date is provided, the function defaults to creating a timestamp
   * for the current date and time.
   * It then checks if an options object is passed in and if it contains a startOfDay property.
   * If it does, it calls the startOf() function on the moment object and sets the time
   * to the start of the day.
   *
   * let date = "2022-11-01";
   * let result = timestamp(date, { startOfDay: true });
   * console.log(result);
   * In this example, result would be a timestamp in milliseconds set to the start of the day "2022-11-01".
   * @param date
   * @param options
   */
  timestamp(
    date?: string | number | Date,
    options?: IHelperDateOptionsCreate,
  ): number {
    const mDate = moment(date ?? undefined);

    if (options?.startOfDay) {
      mDate.startOf('day');
    }

    return mDate.valueOf();
  }

  /**
   * This function format a given date according to a specified format.
   * It takes the input date and an optional options object containing a format property.
   * If the options object is not provided or the format property is not specified,
   * the function defaults to formatting the date according to the default format of ENUM_HELPER_DATE_FORMAT.DATE.
   *
   * let date = new Date();
   * let result = format(date, { format: "YYYY-MM-DD HH:mm:ss" });
   * console.log(result);
   * In this example, result would be a string representation of the date and time in the format "YYYY-MM-DD HH:mm:ss"
   *  @param date
   * @param options
   */
  format(date: Date, options?: IHelperDateOptionsFormat): string {
    return moment(date).format(options?.format ?? ENUM_HELPER_DATE_FORMAT.DATE);
  }

  /**
   * This function create a new date object by forwarding the specified number of milliseconds
   * from the input date.
   * It takes in two arguments, milliseconds and an optional options object which can contain
   * a fromDate property.
   *
   * let date = new Date();
   * let result = forwardInMilliseconds(1000, { fromDate: date });
   * console.log(result);
   * In this example, result would be a Date object that is forward by 1000 milliseconds from the input date.
   * @param milliseconds
   * @param options
   */
  forwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsForward,
  ): Date {
    return moment(options?.fromDate).add(milliseconds, 'ms').toDate();
  }

  /**
   * This function create a new date object by going backward the specified number of milliseconds
   * from the input date.
   * It takes in two arguments, milliseconds and an optional options object which can contain
   * a fromDate property.
   *
   * let date = new Date();
   * let result = backwardInMilliseconds(1000, { fromDate: date });
   * console.log(result);
   * In this example, result would be a Date object that is backward by 1000 milliseconds from the input date.
   * @param milliseconds
   * @param options
   */
  backwardInMilliseconds(
    milliseconds: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment(options?.fromDate).subtract(milliseconds, 'ms').toDate();
  }

  forwardInSeconds(seconds: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(seconds, 's').toDate();
  }

  backwardInSeconds(
    seconds: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment(options?.fromDate).subtract(seconds, 's').toDate();
  }

  forwardInMinutes(minutes: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(minutes, 'm').toDate();
  }

  backwardInMinutes(
    minutes: number,
    options?: IHelperDateOptionsBackward,
  ): Date {
    return moment(options?.fromDate).subtract(minutes, 'm').toDate();
  }

  forwardInHours(hours: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(hours, 'h').toDate();
  }

  backwardInHours(hours: number, options?: IHelperDateOptionsBackward): Date {
    return moment(options?.fromDate).subtract(hours, 'h').toDate();
  }

  forwardInDays(days: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(days, 'd').toDate();
  }

  backwardInDays(days: number, options?: IHelperDateOptionsBackward): Date {
    return moment(options?.fromDate).subtract(days, 'd').toDate();
  }

  forwardInMonths(months: number, options?: IHelperDateOptionsForward): Date {
    return moment(options?.fromDate).add(months, 'M').toDate();
  }

  backwardInMonths(months: number, options?: IHelperDateOptionsBackward): Date {
    return moment(options?.fromDate).subtract(months, 'M').toDate();
  }

  /**
   * This function create a new date object representing the end of the month from the input date.
   * It takes in an optional date parameter.
   * If no date is provided, the function defaults to using the current date.
   *
   * let date = new Date();
   * let result = endOfMonth(date);
   * console.log(result);
   * n this example, result would be a Date object that is the end of the month of the input date.
   * @param date
   */
  endOfMonth(date?: Date): Date {
    return moment(date).endOf('month').toDate();
  }

  startOfMonth(date?: Date): Date {
    return moment(date).startOf('month').toDate();
  }

  endOfYear(date?: Date): Date {
    return moment(date).endOf('year').toDate();
  }

  startOfYear(date?: Date): Date {
    return moment(date).startOf('year').toDate();
  }

  endOfDay(date?: Date): Date {
    return moment(date).endOf('day').toDate();
  }

  startOfDay(date?: Date): Date {
    return moment(date).startOf('day').toDate();
  }

  /**
   * This function  extract the date, month, and year from the input date.
   * It takes in one argument date which can be a string, number or a Date.
   *
   * let date = new Date();
   * let result = extractDate(date);
   * console.log(result);
   * In this example, result would be an object with properties date, day, month, and year containing
   * the information extracted from the input date.
   * @param date
   */
  extractDate(date: string | Date | number): IHelperDateExtractDate {
    const newDate = this.create(date);
    const day: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_DATE,
    });
    const month: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_MONTH,
    });
    const year: string = this.format(newDate, {
      format: ENUM_HELPER_DATE_FORMAT.ONLY_YEAR,
    });

    return {
      date: newDate,
      day,
      month,
      year,
    };
  }

  /**
   * his function round down the input date to the nearest specified time unit.
   * It takes in one argument date which is a Date object and an optional options object
   * which can contain hour, minute, and second properties.
   *
   * The function creates a moment object from the input date,
   * and calls the set() function on it to set the milliseconds of the date to 0.
   *
   * let date = new Date();
   * let result = roundDown(date, { hour: true, second: true });
   * console.log(result);
   * In this example, result would be a Date object that is rounded down to
   * the nearest hour and second.
   * @param date
   * @param options
   */
  roundDown(date: Date, options?: IHelperDateOptionsRoundDown): Date {
    const mDate = moment(date).set({ millisecond: 0 });

    if (options?.hour) {
      mDate.set({ hour: 0 });
    }

    if (options?.minute) {
      mDate.set({ minute: 0 });
    }

    if (options?.second) {
      mDate.set({ second: 0 });
    }

    return mDate.toDate();
  }

  getStartAndEndDate(
    options?: IHelperDateStartAndEnd,
  ): IHelperDateStartAndEndDate {
    const today = moment();
    const todayMonth = today.format(ENUM_HELPER_DATE_FORMAT.ONLY_MONTH);
    const todayYear = today.format(ENUM_HELPER_DATE_FORMAT.ONLY_YEAR);
    // set month and year
    const year = options?.year ?? todayYear;
    const month = options?.month ?? todayMonth;

    const date = moment(`${year}-${month}-02`, 'YYYY-MM-DD');
    let startDate: Date = date.startOf('year').toDate();
    let endDate: Date = date.endOf('year').toDate();

    if (options?.month) {
      const date = moment(`${year}-${month}-02`, 'YYYY-MM-DD');
      startDate = date.startOf('month').toDate();
      endDate = date.endOf('month').toDate();
    }

    return {
      startDate,
      endDate,
    };
  }
}
