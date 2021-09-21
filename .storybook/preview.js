import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
import '!style-loader!css-loader!../ui/src/stories/styles/style.css';
import '!style-loader!css-loader!../ui/src/stories/styles/themes/oncehub.css';
setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: { inlineStories: true },
}