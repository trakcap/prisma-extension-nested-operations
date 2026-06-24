import { type ExpectStatic, JestAsymmetricMatchers, JestChaiExpect, JestExtend } from "@vitest/expect";
import * as chai from "chai";

chai.use(JestExtend);
chai.use(JestChaiExpect);
chai.use(JestAsymmetricMatchers);

export const expect = chai.expect as ExpectStatic;
