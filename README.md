# cnote_assessment

CLI For Investments

## Steps

---

### Build

```
yarn build
```

### Running Commands

Acceptable commands:

- calc
- create
- list

Acceptable Options:
- calc
    * -aid (account ID)
    * -m, --month (month to calculate for)
- create
    * -aid (account ID)
    * -m, --month (month to )
- list
    * -aid (account ID)
    * -m, --month (month to list all transactions for)

> NOTICE: ID's are SERIAL, and the DB is seeded with an account with an id of `1`

Examples:
```
// Creating a transaction for TODAY
yarn start create -aid 1 -a=10000

// Creating a transaction for a certain date
yarn start create -aid 1 -a=-5000 -d "2022-08-13"

// Listing all transactions for the month of August (Jan is index 0)
yarn start list -aid 1 -m 7

// Calculating accrued interest for all transactions in a given month
yarn start calc -aid 1 -m 11

```
