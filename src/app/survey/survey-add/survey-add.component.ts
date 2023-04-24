import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-survey-add',
  templateUrl: './survey-add.component.html',
  styleUrls: ['./survey-add.component.scss']
})
export class SurveyAddComponent implements OnInit {
  panelOpenState = false;
  addSurvey: any = {};
  surveyQue:any = {};
  surveyAns:any ={};
  states: any = [];
  selState:any =[];
  questionData: any = [];
  edit_question = false;
  date1:any
  survey_for: 'Plumber';
  mode :0;
  
  constructor(public db: DatabaseService,  public dialog: DialogComponent, private router: Router, private route: ActivatedRoute) {
    
    this.addSurvey.survey_for = 'Plumber'

    this.date1 = new Date();
  }
  
  ngOnInit() {
    this.getStateList();
  }
  
  getStateList(){
    this.db.get_rqst('', 'app_master/getStates')
    .subscribe( d => {  
      this.states = d.states;
    });
  }
  
  allState(){
    if( !this.addSurvey.allStates ){
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
  }
  
  
  setState(e, state){
    console.log(e.checked, state);
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
  
  
  
  addQuestion(){
    this.questionData.push({ 'question': this.surveyQue.question, 'answer': [] });
    console.log('====================================');
    console.log(this.questionData.length);
    console.log('====================================');
    this.questionData.reverse();
    this.surveyQue.question = "";
  }
  
  
  addAnswer(index) {
    this.questionData[index]['answer'].push({ 'answer': this.surveyAns.answer });
    this.questionData[index].isanswer = true;
    this.surveyAns.answer = "";
  }
  
  
  deleteQue(i)
  {
    this.questionData.splice(i,1);
    this.dialog.success('Question delete successfully');
  }
  
  
  delAns(pindex, cindex){
    this.questionData[pindex]['answer'].splice(cindex, 1);
    this.dialog.success('Answer delete successfully');
  }
  
  
  saveSurvey(form:any) {

    if(this.questionData.length == 0){
      this.dialog.warning('Please add question');
      return;
    }
    
    if(this.selState.length == 0){
      this.dialog.warning('Please select state');
      return;
    }
    
    var anscount = 0;
    for (let index = 0; index < this.questionData.length; index++) {
      console.log('if condtion 1');
      if (this.questionData[index].answer.length > 0) {
        console.log('in if anwer fill');
        this.questionData[index].isanswer = true;
      }
      else {
        console.log('answer blank');
        this.questionData[index].isanswer = false;
        this.dialog.warning('Please add answer');
        anscount++;
      }
    }
    if (anscount) {
      return;
    }
    
    this.addSurvey.state = this.selState;
    this.addSurvey.question = this.questionData;
  
    var data = this.addSurvey;
      this.db.insert_rqst(data, 'master/addSurvey')
      .subscribe( res => {
        console.log('====================================');
        console.log(res.data);
        console.log('====================================');
        this.router.navigate(['survey-list']);
        this.dialog.success( 'Survey has been successfully added');
      });
  }
  
}
