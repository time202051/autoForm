import type { App } from "vue";
import LCTable from "./src/table.vue";

LCTable.install = (app: App) => {
  app.component(LCTable.__name as string, LCTable);
};

export default LCTable;

export * from "./src/table";
