import { Field, Model, ObjectType } from "couchset";

@ObjectType()
export class MarketData {
  @Field(() => String, { nullable: true })
  symbol: string;

  @Field(() => Number, { nullable: true })
  open: number;

  @Field(() => Number, { nullable: true })
  high: number;

  @Field(() => Number, { nullable: true })
  low: number;

  @Field(() => Number, { nullable: true })
  close: number;

  @Field(() => Number, { nullable: true })
  volume: number;

  @Field(() => Date, { nullable: true })
  date: Date;
}

@ObjectType()
export class TickerData {
  @Field(() => String, { nullable: true })
  symbol: string;

  @Field(() => String, { nullable: true })
  industry?: string;

  @Field(() => String, { nullable: true })
  logo: string;

  // ...
}

export const MarketDataModel = new Model(MarketData.name);
