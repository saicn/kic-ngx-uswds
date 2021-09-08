import { Directive, ElementRef, forwardRef, Inject, Input, OnDestroy, Optional } from "@angular/core";
import { NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidatorFn, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { DateAdapter } from "./date-adapter/date-adapter";
import { UsaDateFormats, USA_DATE_FORMATS } from "./date-adapter/date-formats";
import { DateSelectionModelChange } from "./date-selection-model";
import { UsaDatepickerPanel, UsaDatepickerControl } from "./datepicker-base";
import { DateFilterFn, UsaDatepickerInputBase } from "./datepicker-input-base";

/** @docs-private */
export const USA_DATEPICKER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UsaDatepickerInput),
  multi: true
};

/** @docs-private */
export const USA_DATEPICKER_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => UsaDatepickerInput),
  multi: true
};

@Directive({
  selector: 'input[usaDatepicker]',
  providers: [
    USA_DATEPICKER_VALUE_ACCESSOR,
    USA_DATEPICKER_VALIDATORS,
  ],
  host: {
    'class': 'usa-input',
    '[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
    '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
    '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
    '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
    '[disabled]': 'disabled',
    '(input)': '_onInput($event.target.value)',
    '(change)': '_onChange()',
    '(blur)': '_onBlur()',
    '(keydown)': '_onKeydown($event)',
  },
  exportAs: 'usaDatepickerInput',
})
export class UsaDatepickerInput<D> extends UsaDatepickerInputBase<D | null, D>
  implements UsaDatepickerControl<D | null>, OnDestroy {
  private _closedSubscription = Subscription.EMPTY;

  /** The datepicker that this input is associated with. */
  @Input()
  set usaDatepicker(datepicker: UsaDatepickerPanel<UsaDatepickerControl<D>, D | null, D>) {
    if (datepicker) {
      this._datepicker = datepicker;
      this._closedSubscription = datepicker.closedStream.subscribe(() => this._onTouched());
      this._registerModel(datepicker.registerInput(this));
    }
  }
  _datepicker: UsaDatepickerPanel<UsaDatepickerControl<D>, D | null, D>;

  /** The minimum valid date. */
  @Input()
  get min(): D | null { return this._min; }
  set min(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

    if (!this._dateAdapter.sameDate(validValue, this._min)) {
      this._min = validValue;
      this._validatorOnChange();
    }
  }
  private _min: D | null;

  /** The maximum valid date. */
  @Input()
  get max(): D | null { return this._max; }
  set max(value: D | null) {
    const validValue = this._dateAdapter.getValidDateOrNull(this._dateAdapter.deserialize(value));

    if (!this._dateAdapter.sameDate(validValue, this._max)) {
      this._max = validValue;
      this._validatorOnChange();
    }
  }
  private _max: D | null;

  /** Function that can be used to filter out dates within the datepicker. */
  @Input('usaDatepickerFilter')
  get dateFilter() { return this._dateFilter; }
  set dateFilter(value: DateFilterFn<D | null>) {
    const wasMatchingValue = this._matchesFilter(this.value);
    this._dateFilter = value;

    if (this._matchesFilter(this.value) !== wasMatchingValue) {
      this._validatorOnChange();
    }
  }
  private _dateFilter: DateFilterFn<D | null>;

  /** The combined form control validator for this input. */
  protected _validator: ValidatorFn | null;

  constructor(
    elementRef: ElementRef<HTMLInputElement>,
    @Optional() dateAdapter: DateAdapter<D>,
    @Optional() @Inject(USA_DATE_FORMATS) dateFormats: UsaDateFormats,) {
    super(elementRef, dateAdapter, dateFormats);
    this._validator = Validators.compose(super._getValidators());
  }

  /**
   * Gets the element that the datepicker popup should be connected to.
   * @return The element to connect the popup to.
   */
  getConnectedOverlayOrigin(): ElementRef {
    return this._elementRef;
  }

  /** Gets the ID of an element that should be used a description for the calendar overlay. */
  getOverlayLabelId(): string | null {
    return this._elementRef.nativeElement.getAttribute('aria-labelledby');
  }


  /** Gets the value at which the calendar should start. */
  getStartValue(): D | null {
    return this.value;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this._closedSubscription.unsubscribe();
  }

  /** Opens the associated datepicker. */
  protected _openPopup(): void {
    if (this._datepicker) {
      this._datepicker.open();
    }
  }

  protected _getValueFromModel(modelValue: D | null): D | null {
    return modelValue;
  }

  protected _assignValueToModel(value: D | null): void {
    if (this._model) {
      this._model.updateSelection(value, this);
    }
  }

  /** Gets the input's minimum date. */
  _getMinDate() {
    return this._min;
  }

  /** Gets the input's maximum date. */
  _getMaxDate() {
    return this._max;
  }

  /** Gets the input's date filtering function. */
  protected _getDateFilter() {
    return this._dateFilter;
  }

  protected _shouldHandleChangeEvent(event: DateSelectionModelChange<D>) {
    return event.source !== this;
  }
}