import { Report } from "./Report";

export class Result<T> {
  data: T;
  message: string;
  success: boolean;
  errors: Report[];

  constructor(data: T, message: string, success = true, error: Report[] = []) {
    this.data = data;
    this.message = message;
    this.success = success;
    this.errors = error;
  }
}
