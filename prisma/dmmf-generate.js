const writeFileSync = require("node:fs").writeFileSync;

const generatorHelper = require("@prisma/generator-helper");

generatorHelper.generatorHandler({
  onManifest: () => {
    return {
      prettyName: "DMMF generator",
      defaultOutput: "./dmmf.ts",
    };
  },
  // biome-ignore lint/suspicious/useAwait: onGenerate should return Promise, even if it's sync like in our case
  onGenerate: async (options) => {
    writeFileSync(
      options.generator.output.value,
      `export const dmmf = ${JSON.stringify({ datamodel: { models: options.dmmf.datamodel.models } })};`,
    );
  },
});
