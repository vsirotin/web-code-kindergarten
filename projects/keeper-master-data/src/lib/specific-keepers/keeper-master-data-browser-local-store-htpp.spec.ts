import { LoggerFactory } from "@vsirotin/log4ts";
import { KeeperMasterDataBrowserLocalStoreHtppForComponentWithVersion } from "./keeper-master-data-browser-local-store-htpp";
import { HTTPKeyValueRepositoryReader } from "../specific-readers/reader-http";

describe ('KeeperMasterDataBrowserLocalStoreHtppForComponentWithVersion...', () => {
    let keeper: KeeperMasterDataBrowserLocalStoreHtppForComponentWithVersion<string>;
    let componentCoordinate: string = "componentCoordinate";
    let componentVersion: number = 123;
    let key: string = "keyForKeeperTest";
    let expectedLocalStorageKey: string = componentCoordinate + "-v-" + componentVersion + "-" + key;
    let value: string|undefined = undefined;

    beforeEach(() => {
        keeper = new KeeperMasterDataBrowserLocalStoreHtppForComponentWithVersion(componentCoordinate, componentVersion);
    });

    afterEach(() => {
        value = undefined;
        localStorage.removeItem(expectedLocalStorageKey);
    });

    it('should be created ', () => {
        expect(keeper).toBeTruthy();
    });

    it('should not find value by default', async () => {
        let result = await keeper.findAsync(key);
        expect(result).toEqual(undefined);
    });

    it('should read previously saved value', async () => {
        value = "ValueForTest16";
        localStorage.setItem(expectedLocalStorageKey, value);
        let result = await keeper.findAsync(key);
        expect(result).toEqual(value);
    });

   

    it('should call fetch  by default', async () => {
        const consoleSpyWarn = spyOn(window, 'fetch');
        LoggerFactory.setLogLevelsByAllLoggers(0);
        let result = await keeper.findAsync(key);
        expect(consoleSpyWarn).toHaveBeenCalled();
        consoleSpyWarn.calls.reset();
        LoggerFactory.clearAllLoggers();
        expect(result).toEqual(undefined);

    });

    it('should call logger with warn  by default', async () => {
        const consoleSpyWarn = spyOn(console, 'warn');
        LoggerFactory.setLogLevelsByAllLoggers(0);
        let result = await keeper.findAsync(key);
        expect(consoleSpyWarn).toHaveBeenCalled();
        consoleSpyWarn.calls.reset();
        LoggerFactory.clearAllLoggers();
        expect(result).toEqual(undefined);

    });
    describe ('by using of HTTP reader...', () => {
        let httpReaderSpy: jasmine.Spy<(key: string) => Promise<Object | undefined>>;

        beforeEach(() => {
            httpReaderSpy = spyOn(HTTPKeyValueRepositoryReader.prototype, 'readAsync').and.returnValue(Promise.resolve(undefined));
        });

        afterEach(() => {
            httpReaderSpy.calls.reset();
        });

        it('should call http-reader by default', async () => {
            await keeper.findAsync(key);
            expect(httpReaderSpy).toHaveBeenCalledWith(key);
            
        });

        it('should not call http-reader when a vallue already set', async () => {
            value = "ValueForTest17";
            localStorage.setItem(expectedLocalStorageKey, value);
            await keeper.findAsync(key);
            expect(httpReaderSpy).not.toHaveBeenCalled();
        });
    
        it('should not call http-reader after save value', async () => {
            value = "ValueForTest18"
            await keeper.saveAsync(key, value);
            await keeper.findAsync(key);
            expect(httpReaderSpy).not.toHaveBeenCalled();
        });
    });
});