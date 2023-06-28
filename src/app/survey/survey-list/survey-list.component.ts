import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import { DatabaseService } from 'src/app/_services/DatabaseService';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})
export class SurveyListComponent implements OnInit {


  surveyData:any =[];
  filter: any = {};
  last_page: number;
  surveyListData:any;
  current_page = 1;
  page_limit = 1;
  filtering: any = false;
  loading_list = false;

  constructor(public db: DatabaseService,  public dialog: DialogComponent, private router: Router, private route: ActivatedRoute) { 

    this.surveyList();
  }

  ngOnInit() {
  }

  redirect_previous() {
    this.current_page;
    this.surveyList();
  }
  
  redirect_next() {
    if (this.current_page < this.last_page) {
      this.current_page++;
    } else {
      this.current_page = 1;
    }
    this.surveyList();
  }



  surveyList() {
    console.log(this.filter);
    this.loading_list = true;
    this.filter.start_date = this.filter.start_date ? this.db.pickerFormat(this.filter.start_date) : '';
    this.filter.end_date = this.filter.end_date ? this.db.pickerFormat(this.filter.end_date) : '';
    if (this.filter.start_date) this.filtering = true;
    if (this.filter.end_date) this.filtering = true;

    this.filter.mode = 0;

    this.loading_list = true;
      this.db.insert_rqst({'filter':this.filter}, 'master/surveyList?page=' + this.current_page)
      .subscribe( res => {
        console.log('====================================');
        console.log(res);
        console.log(res.surveyList.data);
        this.surveyListData = res.surveyList;
        this.surveyData = res.surveyList.data;
        this.current_page = res.surveyList.current_page;
        this.last_page = res.surveyList.last_page;
        this.loading_list = false;
      });
  }

  deleteSurvey(id) {
    this.dialog.delete('Karigar').then((result) => {
      if (result) {
        this.db.post_rqst({'id': id}, 'master/deleteSurvey')
        .subscribe(d => {
          //console.log(d);
          this.surveyList();
          this.dialog.successfully();
        });
      }
    });
  }

}
