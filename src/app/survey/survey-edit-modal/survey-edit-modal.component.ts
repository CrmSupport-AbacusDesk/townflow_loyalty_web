import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import * as moment from 'moment';

@Component({
  selector: 'app-survey-edit-modal',
  templateUrl: './survey-edit-modal.component.html',
  styleUrls: ['./survey-edit-modal.component.scss']
})
export class SurveyEditModalComponent implements OnInit {
  panelOpenState = false;
  editSurvey: any = {};
  editSurveyState:any ={};
  surveyQue:any = {};
  surveyAns:any ={};
  states:any = [];
  selState:any =[];
  date : any;
  dataValue:any;
  queID:any={}
  ansID:any={}
  surverUser:any =[];
  
  
  
  constructor(public db: DatabaseService,  public dialog: DialogComponent, private router: Router, private route: ActivatedRoute, @Inject(MAT_DIALOG_DATA) public data, private dialogRef : MatDialog,) {
    console.log(data);
    this.dataValue = data['target'];
    this.queID = data['queId'];
    this.ansID = data['ansId'];
    
    this.editSurvey = data['surveyData'];
    for (let i = 0; i < data['surveyData']['states'].length; i++) {
      this.selState.push(data['surveyData']['states'][i]['state_name'])  
    }
    this.editSurvey.valid_from = moment(data['surveyData']['valid_from']).format('YYYY-MM-DD');
    this.editSurvey.valid_to = moment(data['surveyData']['valid_to']).format('YYYY-MM-DD');
    
    
  }
  
  ngOnInit() {
    
    if (this.dataValue == 2) {
      this.getStateList();
    }
    else {
      this.getSurveyUser();
    }
  }
  
  
  getStateList(){
    this.db.get_rqst('', 'app_master/getStates')
    .subscribe( d => {  
      this.states = d.states;
      
      for (let i = 0; i < this.selState.length; i++) 
      {
        
        let index = this.states.findIndex(r=> r.state_name == this.selState[i]);
        if(index != -1)
        {
          this.states[index]['selected']=true
        }
      }
      
    });
  }
  allState(event, index,action){
    
    console.log('Checked - '+event);
    console.log('Index - '+index);
    console.log('Action - '+action);
    
    if( !this.editSurveyState.allStates ){
      this.selState= [];
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].selected = false;
      }
    }else{
      this.selState= [];
      for (let i = 0; i < this.states.length; i++) {
        this.states[i].selected = true;
        this.selState.push(this.states[i].state_name);
        
      }
    }
    
    console.log('====================================');
    console.log(this.selState);
    console.log('====================================');
    
  }
  
  
  setState(e, state){
    console.log(e.checked, state);
    console.log('====================================');
    console.log(this.selState);
    console.log('====================================');
    if(e.checked == true){
      this.selState.push(state);
    }
    else{
      let removeindex = this.selState.findIndex(r=> r == state );
      console.log(removeindex);
      this.selState.splice(removeindex, 1);
    }
    console.log(this.selState);
  }
  
  
  updateSurvey() {
    this.db.post_rqst(  {'id' : this.editSurvey.id, 'title' : this.editSurvey.title, 'start_date' : this.editSurvey.valid_from, 'end_date' : this.editSurvey.valid_to, 'survey_for' : this.editSurvey.servey_for } , 'master/updateSurvey')
    .subscribe( res => {
      
      if(res['msg'] == 'success'){
        this.dialog.success('Survey information update successfully');
        this.dialogRef.closeAll();
      }
    });
  }
  
  updateSurveyArea(){
    this.db.post_rqst(  {'survey_id' : this.editSurvey.id, 'state' : this.selState, } , 'master/updateSurveyState')
    .subscribe( res => {
      if(res['msg'] == 'success'){
        this.dialog.success('Area update successfully');
        this.dialogRef.closeAll();
      }
    });
  }
  
  getSurveyUser(){
    this.db.post_rqst({'question_id':this.queID, 'answer_id':this.ansID}, 'master/getSurveyReport')
    .subscribe( res => {  
      this.surverUser = res.list;
      console.log('====================================');
      console.log(this.surverUser);
      console.log('====================================');
      
    });
  }
  
}
