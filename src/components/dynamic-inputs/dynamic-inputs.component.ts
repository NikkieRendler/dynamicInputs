import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

enum SELECT_NUMBER {
  NONE = 'NONE',
  FIRST = 'First',
  SECOND = 'SECOND',
  THIRD = 'THIRD'
}

export interface OptionsSelection {
  selectNumber: SELECT_NUMBER;
  formGroupPosition: number;
}

@Component({
  selector: 'app-dynamic-inputs',
  templateUrl: './dynamic-inputs.component.html',
  styleUrls: ['./dynamic-inputs.component.scss']
})
export class DynamicInputsComponent implements OnInit {
  selectNumber = SELECT_NUMBER;
  firstSelectOptions: string[] = ['All Pages', 'Home Page', 'Product Page', 'Password Page', 'Custom'];
  secondSelectOptions: string[] = ['Contains', 'Match'];
  selectOptionsToShow = {} as OptionsSelection;

  inclusionRulesForm: FormGroup;
  inclusionRulesArray: FormArray;
  constructor(public fb: FormBuilder) { }

  get formGroupList() {
    return this.inclusionRulesArray.controls as FormGroup[];
  }

  ngOnInit() {
    this.inclusionRulesArray = this.fb.array([]);
    this.inclusionRulesForm = this.fb.group({
      first: [this.firstSelectOptions[0]],
      second: [this.secondSelectOptions[0]],
      third: []
    });
  }

  openSelection(selectNumber: SELECT_NUMBER, formGroupPosition: number) {
    this.clearSelection();
    this.selectOptionsToShow = { selectNumber, formGroupPosition };
    console.log(this.selectOptionsToShow);

  }

  selectOption(optionPosotion: number, optionValue: string, controlName: string) {
    this.clearSelection();
    this.formGroupList[optionPosotion].controls[`${controlName}`].setValue(optionValue);
    if (optionValue === 'Match') {
      this.formGroupList[optionPosotion].controls.third.setValidators(Validators.required);
    }
  }

  clearSelection() {
    this.selectOptionsToShow = { selectNumber: this.selectNumber.NONE, formGroupPosition: null };
  }
  addRule() {
    const newRule = this.fb.group({
      first: [this.firstSelectOptions[0]],
      second: [this.secondSelectOptions[0]],
      third: []
    });
    this.inclusionRulesArray.push(newRule);
  }

  removeRule(rulePosition) {
    this.inclusionRulesArray.removeAt(rulePosition);
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
