import { Component, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-searchable-select',
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true
    }
  ]
})
export class SearchableSelectComponent implements ControlValueAccessor, OnChanges {
  @Input() placeholder: string = '';
  @Input() options: any[] = [];
  @Input() displayField: string = 'name';
  @Input() valueField: string = 'name';
  @Input() infoText: string = '';
  @Input() showActions: boolean = true;
  @Input() doctypeName: string = 'Document';

  searchTerm: string = '';
  showDropdown: boolean = false;
  filteredOptions: any[] = [];

  value: any = '';
  onChange: any = () => {};
  onTouch: any = () => {};
  disabled: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options) {
      this.filterOptions();
      this.updateSearchTermFromValue();
    }
  }

  writeValue(value: any): void {
    this.value = value;
    this.updateSearchTermFromValue();
  }

  updateSearchTermFromValue(): void {
    if (this.options && this.options.length > 0) {
      const selected = this.options.find(opt => opt[this.valueField] === this.value);
      this.searchTerm = selected ? selected[this.displayField] : (this.value || '');
    } else {
      this.searchTerm = this.value || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: any): void {
    this.searchTerm = event.target.value;
    this.filterOptions();
    this.showDropdown = true;
    
    // If we want to allow typing new values that are not in the list (like custom text)
    this.value = this.searchTerm;
    this.onChange(this.value);
  }

  filterOptions(): void {
    if (!this.searchTerm) {
      this.filteredOptions = this.options;
    } else {
      this.filteredOptions = this.options.filter(opt => {
        const displayValue = opt[this.displayField] ? opt[this.displayField].toString() : '';
        return displayValue.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    }
  }

  selectOption(opt: any): void {
    this.value = opt[this.valueField];
    this.searchTerm = opt[this.displayField];
    this.showDropdown = false;
    this.onChange(this.value);
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    this.showDropdown = !this.showDropdown;
    if (this.showDropdown) {
      this.filterOptions();
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
      this.onTouch();
      // Optional: Reset searchTerm to match value if it doesn't match any option
      const selected = this.options.find(opt => opt[this.valueField] === this.value);
      if (selected) {
        this.searchTerm = selected[this.displayField];
      }
    }, 200);
  }
}
