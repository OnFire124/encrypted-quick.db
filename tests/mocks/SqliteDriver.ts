import { SqliteDriver } from "../../src/drivers/SqliteDriver";
jest.mock("../../src/drivers/SqliteDriver.ts");

const SqliteDriverMock = SqliteDriver as jest.MockedClass<typeof SqliteDriver>;

SqliteDriverMock.mock;
SqliteDriverMock.mockImplementation((table: string) => {
    const database = {} as any;
    database[table] = {};

    return {
        database,
        prepare: jest.fn((table: string) => {
            if (!database[table]) database[table] = {};
            return Promise.resolve();
        }),
        getAllRows: jest.fn((table: string) => {
            return Promise.resolve(
                Object.entries(database[table]).map(([id, value]) => ({
                    id,
                    value,
                }))
            );
        }),
        getRowByKey: jest.fn((table: string, key: string) => {
            return Promise.resolve(database[table][key] ?? null);
        }),
        setRowByKey: jest.fn((table: string, key: string, value: any) => {
            database[table][key] = value;
            return Promise.resolve(value);
        }),
        deleteAllRows: jest.fn((table: string) => {
            const changes = Object.keys(database[table]).length;
            database[table] = {};
            return Promise.resolve(changes);
        }),
        deleteRowByKey: jest.fn((table: string, key: string) => {
            const changes = database[table][key] ? 1 : 0;
            delete database[table][key];
            return Promise.resolve(changes);
        }),
    };
});

export { SqliteDriverMock };
