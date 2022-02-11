import { Meta, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";
import { UsaSidenavComponent, UsaSidenavModule } from "@gsa-sam/ngx-uswds";
import { FormsModule } from '@angular/forms';
import { action } from "@storybook/addon-actions";
import { sidenavModel } from "./side-navigation.data";
import { generateConfig, generateGithubLink } from "src/sandbox/sandbox-utils";

const actionsData = {
  sidenavClicked: action('Text Change'),
};

const template = require('!!raw-loader!./side-navigation-basic/side-navigation-basic.component.html');

export default {
  title: 'Components/SideNavigation',
  component: UsaSidenavComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, FormsModule, UsaSidenavModule],
    }),
  ],
  args: {
    sidenavContent: sidenavModel,
    expandType: 'single',
    enableLabelCollapse: false,
    autoCollapseLabels: false,
    selectFirstLabelChild: true,
    sidenavClicked: actionsData.sidenavClicked,
  },
  parameters: {
    githubLink: generateGithubLink('components/side-navigation')
  }
} as Meta;


export const Basic = (args) => ({
  template: template.default,
  props: {
    sidenavContent: args.sidenavContent,
    expandType: args.expandType,
    enableLabelCollapse: args.enableLabelCollapse,
    autoCollapseLabels: args.autoCollapseLabels,
    selectFirstLabelChild: args.selectFirstLabelChild,
    sidenavClicked: actionsData.sidenavClicked,
  }
});

Basic.parameters = {
  preview: generateConfig('components/side-navigation/side-navigation-basic', 'SideNavigationBasicModule', 'side-navigation-basic'),
  githubLink: generateGithubLink('components/side-navigation/side-navigation-basic'),
}

