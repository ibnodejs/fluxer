import { ISchemaOptions, FieldType } from 'influx';

export const MarketDataMeasurement = 'market';

export interface MarketDataSchema {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
};

export const marketDataSchema: ISchemaOptions = {
    measurement: MarketDataMeasurement,
    fields: {
        open: FieldType.FLOAT,
        high: FieldType.FLOAT,
        low: FieldType.FLOAT,
        close: FieldType.FLOAT,
        volume: FieldType.INTEGER
    },
    tags: [
        'symbol'
    ]
}