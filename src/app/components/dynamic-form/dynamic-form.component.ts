import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import inputJSON from '../../../../inputData.json';
import { Options } from '@angular-slider/ngx-slider';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {

  value: number = 5;
  options: Options = {
    floor: 0,
    ceil: 10,
    step: 1,
    showTicks: true,
    showTicksValues: true
  };
  myFormGroup: FormGroup;
  formArray: FormArray;
  formTemplate: any = [];
  label: any = [];
  subLabel: any = [];
  formData: any = [];
  jsonData: any;
  formContentgroup: any = {}
  constructor() {
    this.jsonData = inputJSON.section
    // console.log("input json ", this.jsonData);
    this.formContentgroup = {}
    this.jsonData.forEach(item => {
      // console.log(item);
      if (item.group) {
        let element = item.group
        this.label.push(item.name)
        // console.log(element);
        if (element.length > 0) {
          element.forEach(e => {
            this.subLabel.push(e['name'])
            if (e.parameters.length > 0) {
              let parameters = e.parameters;
              parameters.forEach(subitem => {
                // console.log(subitem);
                this.formContentgroup[subitem['key']] = new FormControl('');
              })
            }
          })
        }
      }


      // this.formContentgroup[]=new FormControl('');  
    })

    // this.myFormGroup = new FormGroup(this.formContentgroup);
    // console.log("my FORM :", this.myFormGroup.value);
    this.myFormGroup = new FormGroup(this.formContentgroup);
    console.log("my FORM :", this.myFormGroup.value);
  }


  ngOnInit(): void {

  }

  onSubmit(e) {
    e.preventDefault();
    // console.log("form data : ", this.myFormGroup.value);
    let sectionArray = [];
    let sectionMainObj = {};
    let form = this.myFormGroup.value
    // obj['section'] = 

    this.jsonData.forEach(element => {

      if (element.group.length > 0) {
        let mainObj = {};
        let item = element.group
        let grpArray = [];
        item.forEach(subitem => {
          let groupObj = {};
          if (subitem.parameters.length > 0) {
            let items = subitem.parameters
            let subArray = [];
            let subObj = {};
            console.log(items);

            for (let i = 0; i < items.length; i++) {
              // console.log("this.myFormGroup.value.hasOwnProperty(items[i].key) : ",form.hasOwnProperty(items[i].key));

              if (form.hasOwnProperty(items[i].key)) {
                subObj['key'] = items[i].key
                subObj['value'] = form[items[i].key]
                subArray.push(subObj)
                //  console.log(subObj);
              }
              subObj = {}
            }
            groupObj['name'] = subitem.name
            groupObj['parameters'] = subArray
            subArray = [];
          }
          grpArray.push(groupObj)
          groupObj = {}
        });
        mainObj['name'] = element.name
        mainObj['group'] = grpArray
        grpArray = []
        sectionArray.push(mainObj)
        mainObj={}
      }
    });
    sectionMainObj['section'] = sectionArray

    // console.log(sectionMainObj);
    // window.open("data:application/json;charset=UTF-8," + encodeURIComponent(JSON.stringify(sectionMainObj)))
    this.saveText( JSON.stringify(sectionMainObj,null,4), "outputDATA.json" );
  }


  saveText(text, filename){
    var a = document.createElement('a');
    a.setAttribute('href', 'data:application/json;charset=UTF-8,'+encodeURIComponent(text));
    a.setAttribute('download', filename);
    a.click()
  }
}
