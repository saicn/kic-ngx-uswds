import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { UsaAccordionModule } from "@gsa-sam/ngx-uswds";
import { AccordionDisableAnimation } from "./disable-animation.component";


@NgModule({
  imports: [
    CommonModule,
    UsaAccordionModule
  ],
  declarations: [
    AccordionDisableAnimation
  ],
  exports: [
    AccordionDisableAnimation
  ]
})
export class AccordionDisableAnimationModule { }
