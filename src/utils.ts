export type ArgType = ICalcArgs | ICreateArgs | IGetArgs | IListArgs;

export enum ARG_TYPE {
  CALC = "calc",
  CREATE = "create",
  GET = "get",
  LIST = "list",
}

interface BaseArgs<T extends ARG_TYPE> {
  aid: number;
  type: T;
}
interface ICalcArgs extends BaseArgs<ARG_TYPE.CALC> {
  m: number;
  month: number;
}
interface ICreateArgs extends BaseArgs<ARG_TYPE.CREATE> {
  a: number;
  amount: number;
  d?: Date;
  date?: Date;
}
interface IGetArgs extends BaseArgs<ARG_TYPE.GET> {}
interface IListArgs extends BaseArgs<ARG_TYPE.LIST> {
  m: number;
  month: number;
}

export function parseArgs(args: string[]) {
  let previousMatchedValue: string = "";

  const optionsMap: Record<string, string | boolean> = {};
  args.slice(2).forEach((arg, i, list) => {
    const matchedWord = arg.match(
      /(?<withEqualFlag>-+\w+=+[\w-]+)|(?<noEqualFlag>-+\w+)|(?<commandOrValue>\w+[-\w]*)/i
    );
    if (!matchedWord?.groups || typeof matchedWord.groups !== "object") return;
    const { noEqualFlag, withEqualFlag, commandOrValue } = matchedWord!.groups!;

    const replaceTackRegex = /^-{1,2}/i;

    if (noEqualFlag) {
      if (i === list.length - 1) {
        const key = noEqualFlag.replace(replaceTackRegex, "");
        optionsMap[key] = true;
      }
      if (previousMatchedValue.includes("-" || "--")) {
        const key = previousMatchedValue.replace(replaceTackRegex, "");
        optionsMap[key] = true;
      }
      previousMatchedValue = noEqualFlag;
    }

    if (withEqualFlag) {
      const [flag, value] = withEqualFlag.split("=");
      const key = flag.replace(replaceTackRegex, "");
      optionsMap[key] = value;

      previousMatchedValue = "";
    }

    if (commandOrValue) {
      if (previousMatchedValue.includes("-" || "--")) {
        const key = previousMatchedValue.replace(replaceTackRegex, "");
        optionsMap[key] = commandOrValue;
      } else {
        optionsMap[commandOrValue] = true;
      }
      previousMatchedValue = commandOrValue;
    }
  });

  return optionsMap;
}

export function parseCommandArgs(args: ReturnType<typeof parseArgs>): ArgType {
  if (args.calc) {
    const { aid, m, month } = args;
    if (!aid || typeof aid !== "string") {
      throw new Error(
        "Account ID must be provided to calculate interest accrued on a given account"
      );
    }

    const mes = m || month;
    if (!mes || typeof mes !== "string") {
      throw new Error(
        "Please provide a numeric month in order to calculate interest for said month. Denote the month with either (-m) or (--month). January starts at (0), December is (11)"
      );
    }

    return {
      aid: parseInt(aid),
      m: parseInt(mes),
      month: parseInt(mes),
      type: ARG_TYPE.CALC,
    } as ICalcArgs;
  }

  if (args.create) {
    const { aid, a, amount, d, date } = args;
    if (!aid || typeof aid !== "string") {
      throw new Error(
        "Account ID must be provided to create a new transaction for a given account"
      );
    }

    const monto = a || amount;
    if (!monto || typeof monto !== "string") {
      throw new Error(
        "Please provide an amount to create a transaction. Use either (-a) or (--amount)"
      );
    }

    const dArg = d || date;
    if (dArg) {
      if (typeof dArg !== "string") {
        throw new Error(
          "When providing a transaction date, type must be of a date string format (i.e yyyy-mm-dd)"
        );
      }
    }

    return {
      aid: parseInt(aid),
      a: parseInt(monto),
      amount: parseInt(monto),
      d: dArg && new Date(dArg),
      date: dArg && new Date(dArg),
      type: ARG_TYPE.CREATE,
    } as ICreateArgs;
  }

  if (args.get) {
    const { aid } = args;
    if (!aid || typeof aid !== "string") {
      throw new Error(
        "Account ID must be provided to list transactions for a given account"
      );
    }

    return {
      aid: parseInt(aid),
      type: ARG_TYPE.GET,
    } as IGetArgs;
  }

  if (args.list) {
    const { aid, m, month } = args;
    if (!aid || typeof aid !== "string") {
      throw new Error(
        "Account ID must be provided to list transactions for a given account"
      );
    }

    const mes = m || month;
    if (!mes || typeof mes !== "string") {
      throw new Error(
        "Please provide a numeric month in order to list transactions for given month. Denote the month with either (-m) or (--month). January starts at (0), December is (11)"
      );
    }

    return {
      aid: parseInt(aid),
      m: parseInt(mes),
      month: parseInt(mes),
      type: ARG_TYPE.LIST,
    } as IListArgs;
  }

  throw new Error(
    "cli command must contain one of these commands: [calc, create]"
  );
}

export function getLastMillisecondTimestampOfMonth(
  date: Date | string | number
) {
  const getLastDay = (fecha: Date) => {
    return new Date(
      fecha.getFullYear(),
      fecha.getMonth() + 1,
      0,
      23,
      59,
      59,
      999
    );
  };
  if (date instanceof Date) {
    return getLastDay(date);
  }

  if (typeof date === "string" || typeof date === "number") {
    const convertedDate = new Date(date);
    if (convertedDate.getFullYear() < 1900) {
      throw new Error(
        `Years before 1900 are not supported, received: (${convertedDate.getFullYear()})`
      );
    }
    return getLastDay(convertedDate);
  }

  throw new Error("date type is not supported");
}
