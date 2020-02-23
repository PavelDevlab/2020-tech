import {Effect} from "redux-saga/effects";

export type SagaGenerator = Generator<Effect<unknown>, void, any>
