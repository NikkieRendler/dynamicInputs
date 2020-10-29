import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';

enum SELECT_NUMBER {
  NONE = 'NONE',
  FIRST = 'FIRST',
  SECOND = 'SECOND',
  THIRD = 'THIRD'
}

enum RULE_TYPE {
  NONE = 'NONE',
  EXCLUSION = 'EXCLUSION',
  INCLUSION = 'INCLUSION',
}

export interface OptionsSelection {
  selectNumber: SELECT_NUMBER;
  formGroupPosition: number;
  ruleType: RULE_TYPE;
}

@Component({
  selector: 'app-dynamic-inputs',
  templateUrl: './dynamic-inputs.component.html',
  styleUrls: ['./dynamic-inputs.component.scss']
})
export class DynamicInputsComponent implements OnInit {
  selectNumber = SELECT_NUMBER;
  ruleType = RULE_TYPE;

  firstSelectOptions: string[] = ['All Pages', 'Home Page', 'Product Page', 'Password Page', 'Custom'];
  secondSelectOptions: string[] = ['Contains', 'Match'];

  inclusionRulesForm: FormGroup;
  inclusionRulesArray: FormArray;
  exclusionRulesForm: FormGroup;
  exclusionRulesArray: FormArray;

  selectListToShow$: BehaviorSubject<OptionsSelection> = new BehaviorSubject({
    selectNumber: this.selectNumber.NONE, formGroupPosition: null, ruleType: this.ruleType.NONE
  });

  constructor(public fb: FormBuilder) { }

  get inclusionFormGroupList() {
    return this.inclusionRulesArray.controls as FormGroup[];
  }

  get exclusionFormGroupList() {
    return this.exclusionRulesArray.controls as FormGroup[];
  }

  ngOnInit() {
    this.inclusionRulesArray = this.fb.array([]);
    this.inclusionRulesForm = this.fb.group({
      first: [this.firstSelectOptions[0]],
      second: [this.secondSelectOptions[0]],
      third: []
    });
    this.exclusionRulesArray = this.fb.array([]);
    this.exclusionRulesForm = this.fb.group({
      first: [this.firstSelectOptions[0]],
      second: [this.secondSelectOptions[0]],
      third: []
    });
  }

  selectOption(optionPosotion: number, optionValue: string, controlName: string, ruleType: RULE_TYPE) {

    this.handleOptionListView(this.selectNumber.NONE, null, this.ruleType.NONE);
    if (ruleType === this.ruleType.INCLUSION) {
      this.inclusionFormGroupList[optionPosotion].controls[`${controlName}`].setValue(optionValue);
      if (optionValue === 'Match') {
        this.inclusionFormGroupList[optionPosotion].controls.third.setValidators(Validators.required);
      }
    } else {
      this.exclusionFormGroupList[optionPosotion].controls[`${controlName}`].setValue(optionValue);
      if (optionValue === 'Match') {
        this.exclusionFormGroupList[optionPosotion].controls.third.setValidators(Validators.required);
      }
    }
  }

  handleOptionListView(selectNumber: SELECT_NUMBER, formGroupPosition: number, ruleType: RULE_TYPE) {
    this.selectListToShow$.next({ selectNumber, formGroupPosition, ruleType });
  }

  addRule(ruleType: RULE_TYPE) {
    const newRule = this.fb.group({
      first: [this.firstSelectOptions[0]],
      second: [this.secondSelectOptions[0]],
      third: []
    });
    if (ruleType === this.ruleType.INCLUSION) {
      this.inclusionRulesArray.push(newRule);
    } else {
      this.exclusionRulesArray.push(newRule);
    }
  }

  removeRule(rulePosition: number, ruleType: RULE_TYPE) {
    if (ruleType === this.ruleType.INCLUSION) {
      this.inclusionRulesArray.removeAt(rulePosition);
    } else {
      this.exclusionRulesArray.removeAt(rulePosition);
    }
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
