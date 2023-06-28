import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';
import { SurveyEditModalComponent } from '../survey-edit-modal/survey-edit-modal.component';

@Component({
  selector: 'app-survey-detail',
  templateUrl: './survey-detail.component.html',
  styleUrls: ['./survey-detail.component.scss']
})
export class SurveyDetailComponent implements OnInit {
  
  loading_list:any = false;
  surveyData:any={}
  id :any ={};
  queData:any =[];
  state:any =[];
  edit_question:any = false;
  edit_answer:any = false;
  status_change:any
  
  
  constructor(public db: DatabaseService,  public dialog: DialogComponent, private router: Router, private route: ActivatedRoute, public alrt:MatDialog) {
    
  }
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      
      console.log(params);
      this.id = params.id;
      if (this.id) {
        this.surveyDetail();
      }
    });
    
    this.surveyDetail();
  }
  
  
  surveyDetail() {
    this.loading_list = true;
    this.db.insert_rqst({id:this.id}, 'master/surveyDetail')
    .subscribe( res => {
      this.surveyData=res.details
      this.surveyData=res.details

      this.state = res.details.states;
      this.queData = res.details.question;
      this.loading_list = false;
    });
  }
  
  deleteQue(id) {
    this.dialog.delete('Karigar').then((result) => {
      if (result) {
        this.db.post_rqst({'id': id}, 'master/deleteSurveyQuestion')
        .subscribe(d => {
          //console.log(d);
          this.surveyDetail();
          this.dialog.successfully();
        });
      }
    });
  }
  
  deleteAns(id) {
    this.dialog.delete('Karigar').then((result) => {
      if (result) {
        this.db.post_rqst({'id': id}, 'master/deleteSurveyAnswer')
        .subscribe(d => {
          //console.log(d);
          this.surveyDetail();
          this.dialog.successfully();
        });
      }
    });
  }
  
  
  editsurveyQue(queId, question) {
    this.db.post_rqst({'id':queId, 'question':question}, 'master/updateSurveyQuestion')
    .subscribe(res => {
      console.log(res);
      this.dialog.success('Question update successfully');
      this.surveyDetail();
    });
  }
  
  editsurveyanswer(ansId, answer) {
    console.log('====================================');
    console.log(ansId);
    console.log(answer);
    console.log('====================================');
    this.db.post_rqst({'id':ansId, 'answer':answer}, 'master/updateSurveyAnswer')
    .subscribe(res => {
      console.log(res);
      this.dialog.success('Answer update successfully');
      this.surveyDetail();
    });
  }
  
  detailEdit(target,surveyData, queId, ansId) {
    console.log('====================================');
    console.log(queId, ansId);
    console.log('====================================');
    const dialogRef = this.alrt.open(SurveyEditModalComponent,
      {
        width: '768px',
        data: {
          target,
          surveyData,
          queId, ansId
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        this.surveyDetail();
      });
    }
    
    
    updateStatus(status){
      console.log('====================================');
      console.log(status);
      console.log('====================================');
      
      
      if(status== true) {
        this.status_change= 'Active'
      }
      
      else {
        this.status_change= 'Deactive'
      }
      // if(event.checked == true){
      //   status ="Active"
      // }
      // else{
      //   status ="Deactive"
      // }
      
      this.db.post_rqst({'id' : this.id, 'status':this.status_change}, 'master/updateSurveyStatus')
      .subscribe(res => {
        console.log('====================================');
        console.log(res);
        console.log('====================================');
        
        if(res.msg == "success"){
          this.dialog.success( 'Status Change successfully');
          this.surveyDetail();
        }
        else{
          this.dialog.success( 'something went wrong');
        }
        
      });
      
      
    }
    
    
    
  }
  