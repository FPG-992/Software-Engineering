# Back-end

Ενδεικτικά περιεχόμενα:

- Πηγαίος κώδικας εφαρμογής για εισαγωγή, διαχείριση και
  πρόσβαση σε δεδομένα (backend).
- Database dump (sql ή json)
- Back-end functional tests.
- Back-end unit tests.
- RESTful API.




# ts-node
## Giving env file to ts-node
Node has an option to run `node --env-file=env_file_path` or `node --env-file-if-exists=env_file_path` which will create the environment variables defined in that file, the difference between the two is that the `--env-file-if-exists` argument will not throw an error if the file does not exist but `--env-file` will. You can also pass multiple `--env-file=path` or `--env-file-if-exists=path` arguments like this:
```bash
node --env-file=path_1 --env-file=path_2 --env-file-if-exists=path3
```
The assignment of the env files will happen in the order they are written, and the last one will override the previous environment variables that are defined in the last one. (NOTE: `env-file-if-exists` argument needs node 22 or higher)

`ts-node` does not have option for such arguments, so it is not possible directly, however we can use node. Behind the scenes running `npx ts-node filename.ts` is equivalent to running the `node -r ts-node/register filename.ts`. `-r ts-node/register` tells Node.js to require the `ts-node/register` module before executing your TypeScript file.

**Running the ts-node and giving env file to assign environment variables looks something like this:**
```bash
node --env-file=path -r ts-node/register filename.ts
```

In `package.json` you can configure a script to make it easier to run typescript files.
```json
{
  "scripts": {
    "ts-node": "node --env-file=.env -r ts-node/register"
  }
}
```
```bash
npm run ts-node filename.ts
```
**Useful resources:**
- [how-can-i-load-environment-variables-with-ts-node](https://stackoverflow.com/questions/63348710/how-can-i-load-environment-variables-with-ts-node)

## Fixing module resolution issue when using ts-node
If you have defined paths in the `tsconfig.json` and when running a typescript file that uses the defined paths to import things, you get an error with a code `MODULE_NOT_FOUND`, you need to use another dependency alongside your ts-node. The extra dependency is `tsconfig-paths`.

To use paths defined in `tsconfig.json`, for example
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@utils/*": ["./src/utils/*"],
    }, 
  }
}
```
and be able to import like 
```ts
import something from "@utils/path";
```

Simply install running
```bash
npm install --save-dev tsconfig-paths
```
and then you need to require the tsconfig-paths module like we did in the **"Giving env file to ts-node"** section above:
```bash
npx ts-node -r tsconfig-paths/register filename.ts
```

You can require multiple modules and chain them. For example pass env file and to also resolve tsconfig-paths like this:
```bash
node --env-file=.env -r ts-node/register -r tsconfig-paths/register filename.ts
```

For ease having a script like this is recommended in `package.json`
```json
{
  "scripts": {
    "ts-node": "node --env-file=.env -r ts-node/register -r tsconfig-paths/register"
  }
}
```

## Running tests using node's built-in testing "node:test"
If scripts in `package.json` are the following:
```json
{
  "scripts": {
      "ts-node": "node -r ts-node/register -r tsconfig-paths/register"
    }
}
```
For running a specific test, you only need the path to that test file. For example
```bash
npm run ts-node path_to_test_file/filename.test.ts
```
But if you want to run multiple tests, you need to provide `--test` argument with the filepath regex to `node`. Like this
```bash
node -r ts-node/register -r tsconfig-paths/register --test "**/*.test.ts"
```
**NOTE**: You need to provide the `--test` argument after requiring all the modules that are needed for the tests. You can't do the following
```bash
# WRONG
node --test "**/*.test.ts" -r ts-node/register -r tsconfig-paths/register
# WRONG
node -r ts-node/register --test "**/*.test.ts" -r tsconfig-paths/register
```

In `package.json` you should define a script like this
```json
{
  "scripts": {
    "test": "node --env-file=.env -r ts-node/register -r tsconfig-paths/register --test **/*.test.ts"
  }
}
```
and then you can simply run `npm test` or `npm run test` and it will find all the test files and run them.
**?NOTE**: `__dirname` and `__filename` when running tests will have their own values, like running each test file separately. Test file at `tests/filename.test.ts` will have `__filename` equal to `**/tests/filename.test.ts` and `__dirname` accordingly.




