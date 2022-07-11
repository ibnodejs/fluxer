import { Field, Model, ObjectType } from "couchset";

@ObjectType()
export class MarketData {
  @Field(() => String, { nullable: true })
  symbol: string = "";

  @Field(() => Number, { nullable: true })
  open: number = 0;

  @Field(() => Number, { nullable: true })
  high: number = 0;

  @Field(() => Number, { nullable: true })
  low: number = 0;

  @Field(() => Number, { nullable: true })
  close: number = 0;

  @Field(() => Number, { nullable: true })
  volume: number = 0;

  @Field(() => Date, { nullable: true })
  date: Date = new Date();
}

export const MarketDataModel = new Model(MarketData.name);
