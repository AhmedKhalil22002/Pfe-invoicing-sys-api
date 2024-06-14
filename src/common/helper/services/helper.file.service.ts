import { Injectable } from '@nestjs/common';
import bytes from 'bytes';
import { ENUM_HELPER_FILE_TYPE } from 'src/common/helper/constants/helper.enum.constant';
import { IHelperFileService } from 'src/common/helper/interfaces/helper.file-service.interface';
import {
  IHelperFileWriteExcelOptions,
  IHelperFileReadExcelOptions,
  IHelperFileRows,
  IHelperFileCreateExcelWorkbookOptions,
} from 'src/common/helper/interfaces/helper.interface';
import { utils, write, read, WorkBook } from 'xlsx';
import { writeFileSync, readFileSync } from 'fs';

@Injectable()
export class HelperFileService implements IHelperFileService {
  /**
   * const rows = [
   *   {name: 'John', age: 30, sex: 'M'},
   *   {name: 'Jane', age: 25, sex: 'F'},
   *   {name: 'Bob', age: 35, sex: 'M'}
   * ];
   *
   * const workbook = createExcelWorkbook(rows, {sheetName: 'Employees'});
   * In this example, workbook would be an Excel workbook with one sheet named 'Employees'
   * containing 3 rows and 3 columns.
   * Each row representing an employee with three properties (name, age, and sex).
   * @param rows
   * @param options
   */
  createExcelWorkbook(
    rows: IHelperFileRows[],
    options?: IHelperFileCreateExcelWorkbookOptions,
  ): WorkBook {
    // headers
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];

    // worksheet
    const worksheet = utils.json_to_sheet(rows);

    // workbook
    const workbook = utils.book_new();

    utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
    utils.book_append_sheet(
      workbook,
      worksheet,
      options?.sheetName ?? 'Sheet 1',
    );

    return workbook;
  }

  /**
   * The function creates a buffer using the write() method from the xlsx-style library,
   * which writes the workbook to a buffer.
   * It passes in an object with the following properties to the write() method:
   *
   * type: 'buffer' - specifies that the output should be written to a buffer
   * bookType: options?.type ?? ENUM_HELPER_FILE_TYPE.CSV - specifies the format of the output.
   * If type is not provided, it defaults to CSV.
   * password: options?.password - specifies the password for the workbook if provided.
   * It then returns the buffer containing the written workbook.
   *
   * const workbook = createExcelWorkbook(rows, {sheetName: 'Employees'});
   * const buffer = writeExcelToBuffer(workbook, {type: ENUM_HELPER_FILE_TYPE.XLSX});
   * In this example, buffer would be a buffer containing the Excel workbook in XLSX format
   * with one sheet named 'Employees' containing 3 rows and 3 columns.
   * Each row representing an employee with three properties (name, age, and sex).
   * @param workbook
   * @param options
   */
  writeExcelToBuffer(
    workbook: WorkBook,
    options?: IHelperFileWriteExcelOptions,
  ): Buffer {
    // create buffer
    const buff: Buffer = write(workbook, {
      type: 'buffer',
      bookType: options?.type ?? ENUM_HELPER_FILE_TYPE.CSV,
      password: options?.password,
    });

    return buff;
  }

  /**
   * The function creates a workbook using the read() method from the xlsx-style library,
   * which reads the buffer and returns a workbook.
   * It passes in an object with the following properties to the read() method:
   * type: 'buffer' - specifies that the input is a buffer
   * password: options?.password - specifies the password for the workbook if provided.
   * sheets: options?.sheet - specifies the sheets to be read if provided.
   *
   * It then extracts the first worksheet from the workbook using the SheetNames property,
   * which returns an array of sheet names,
   * and the Sheets property, which returns an object containing the sheets.
   *
   * const buffer = writeExcelToBuffer(workbook);
   * const rows = readExcelFromBuffer(buffer);
   * In this example, rows would be an array of JSON objects representing the rows of the worksheet.
   * @param file
   * @param options
   */
  readExcelFromBuffer(
    file: Buffer,
    options?: IHelperFileReadExcelOptions,
  ): IHelperFileRows[] {
    // workbook
    const workbook = read(file, {
      type: 'buffer',
      password: options?.password,
      sheets: options?.sheet,
    });

    // worksheet
    const worksheetName = workbook.SheetNames;
    const worksheet = workbook.Sheets[worksheetName[0]];

    // rows
    const rows: IHelperFileRows[] = utils.sheet_to_json(worksheet);

    return rows;
  }

  /**
   * This function use the bytes library to convert a value from megabytes to bytes.
   * It takes in one argument, megabytes which is a string representing a value in megabytes.
   *
   * let bytesValue = convertToBytes('2MB');
   * console.log(bytesValue);
   * In this example, bytesValue would be equal to 2097152 which is the value of 2MB in bytes.
   * @param megabytes
   */
  convertToBytes(megabytes: string): number {
    return bytes(megabytes);
  }

  createJson(path: string, data: Record<string, any>[]): boolean {
    const sData = JSON.stringify(data);
    writeFileSync(path, sData);

    return true;
  }
  readJson(path: string): Record<string, any>[] {
    const data: string = readFileSync(path, 'utf8');
    return JSON.parse(data);
  }
}
